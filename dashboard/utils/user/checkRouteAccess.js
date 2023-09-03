export const checkRouteAccess = (user, role, subrole) => {

  if (!role.includes(user.role)) return false;

  if (!subrole.includes(user.subrole)) false

  return true;
};

