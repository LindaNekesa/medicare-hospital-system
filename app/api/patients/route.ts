import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/patients
// Supports: ?page=1&limit=50&search=john&gender=MALE&cursor=123
// Returns paginated patients — never loads the full table at once
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const page   = Math.max(1, parseInt(searchParams.get("page")   ?? "1",  10));
    const limit  = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const search = searchParams.get("search")?.trim() ?? "";
    const gender = searchParams.get("gender") ?? undefined;
    const cursor = searchParams.get("cursor") ? parseInt(searchParams.get("cursor")!, 10) : undefined;

    // Build where clause — uses indexed columns only
    const where = {
      ...(gender ? { gender } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName:  { contains: search, mode: "insensitive" as const } },
              { phone:     { contains: search } },
              { user: { email: { contains: search, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    };

    // Run count and data fetch in parallel
    const [total, patients] = await Promise.all([
      prisma.patient.count({ where }),
      prisma.patient.findMany({
        where,
        // Cursor-based pagination is faster than offset for large tables
        ...(cursor
          ? { cursor: { id: cursor }, skip: 1 }
          : { skip: (page - 1) * limit }),
        take: limit,
        orderBy: { createdAt: "desc" },
        // Select only what the UI needs — avoids loading large text fields
        select: {
          id:          true,
          firstName:   true,
          lastName:    true,
          gender:      true,
          dateOfBirth: true,
          bloodType:   true,
          phone:       true,
          insurance:   true,
          createdAt:   true,
          user: {
            select: { email: true, id: true },
          },
        },
      }),
    ]);

    const lastItem = patients[patients.length - 1];

    return NextResponse.json({
      data:       patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      nextCursor: lastItem?.id ?? null,
      hasMore:    patients.length === limit,
    });
  } catch (error) {
    console.error("[GET /api/patients]", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

// POST /api/patients — create a new patient record
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields before hitting the DB
    if (!data.userId || !data.firstName || !data.lastName || !data.gender || !data.dateOfBirth) {
      return NextResponse.json(
        { error: "Missing required fields: userId, firstName, lastName, gender, dateOfBirth" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        userId:          parseInt(data.userId, 10),
        firstName:       data.firstName.trim(),
        lastName:        data.lastName.trim(),
        gender:          data.gender,
        dateOfBirth:     new Date(data.dateOfBirth),
        bloodType:       data.bloodType       || null,
        phone:           data.phone           || null,
        address:         data.address         || null,
        insurance:       data.insurance       || null,
        emergencyContact: data.emergencyContact || null,
      },
      select: {
        id: true, firstName: true, lastName: true,
        gender: true, phone: true, createdAt: true,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/patients]", error);
    // Unique constraint — patient already exists for this user
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Patient record already exists for this user" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}

// PATCH /api/patients — update a patient record
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Patient id is required" }, { status: 400 });
    }

    const { id, ...updates } = data;

    const patient = await prisma.patient.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...(updates.firstName       && { firstName:       updates.firstName.trim() }),
        ...(updates.lastName        && { lastName:        updates.lastName.trim() }),
        ...(updates.gender          && { gender:          updates.gender }),
        ...(updates.phone           !== undefined && { phone:           updates.phone || null }),
        ...(updates.address         !== undefined && { address:         updates.address || null }),
        ...(updates.bloodType       !== undefined && { bloodType:       updates.bloodType || null }),
        ...(updates.insurance       !== undefined && { insurance:       updates.insurance || null }),
        ...(updates.emergencyContact !== undefined && { emergencyContact: updates.emergencyContact || null }),
        ...(updates.dateOfBirth     && { dateOfBirth: new Date(updates.dateOfBirth) }),
      },
      select: { id: true, firstName: true, lastName: true, updatedAt: true },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATCH /api/patients]", error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}
