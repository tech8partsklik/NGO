// ===== TOKEN STORAGE =====
export const setToken = (access) => {
  localStorage.setItem("access_token", access);
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const setRefreshToken = (refresh) => {
  localStorage.setItem("refresh_token", refresh);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

// ===== USER STORAGE =====
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ===== CLEAR ALL =====
export const clearStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};
