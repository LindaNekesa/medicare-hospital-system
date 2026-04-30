export const MAX_ATTEMPTS = 5
export const LOCK_TIME_MINUTES = 15

export function getLockTime() {
  return new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000)
}
export function isLocked(lockTime: Date) {
  return new Date() < lockTime
}
