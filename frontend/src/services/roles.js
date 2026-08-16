export function isAdmin(user) {
  return Boolean(user?.is_superuser || user?.role === "ADMIN");
}

export function isMember(user) {
  return Boolean(user && !isAdmin(user) && user.role === "MEMBER");
}

export function homeForUser(user) {
  return isAdmin(user) ? "/dashboard" : "/client";
}
