const ADMIN_KEY = "aegis-admin-123";

export const loginAdmin = (key: string) => {
  if (key === ADMIN_KEY) {
    localStorage.setItem("isAdmin", "true");
    return true;
  }
  return false;
};

export const isAdmin = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isAdmin") === "true";
};

export const logoutAdmin = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("isAdmin");
};
