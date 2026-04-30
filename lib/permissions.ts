export function canManageAppointments(role?: string) {
  return role === "ADMIN" || role === "STAFF"
}

export function canViewOwnAppointments(role?: string) {
  return role === "PATIENT"
}