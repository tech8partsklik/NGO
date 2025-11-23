// TOKEN
export const getToken = () => localStorage.getItem("access_token");
export const setToken = (token) => localStorage.setItem("access_token", token);
export const removeToken = () => localStorage.removeItem("access_token");

// REFRESH TOKEN
export const getRefreshToken = () => localStorage.getItem("refresh_token");
export const setRefreshToken = (token) =>
  localStorage.setItem("refresh_token", token);
export const removeRefreshToken = () =>
  localStorage.removeItem("refresh_token");

// USER
export const getUser = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => localStorage.removeItem("user");

// ROLE
export const setRole = (role) => localStorage.setItem("role", role);
export const getRole = () => localStorage.getItem("role");
export const removeRole = () => localStorage.removeItem("role");

// CLEAR ALL
export const clearStorage = () => {
  localStorage.clear();
};
