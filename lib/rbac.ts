export function isAdmin(role?: string) {
  return role === "ADMIN"
}

export function isStaff(role?: string) {
  return role === "STAFF"
}

export function isPatient(role?: string) {
  return role === "PATIENT"
}

export function canManageUsers(role?: string) {
  return role === "ADMIN" || role === "STAFF"
}