export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.10:8000";

export const BASE_WS_URL =
  import.meta.env.VITE_WS_URL || "ws://192.168.1.10:8000";

// Commonly used endpoints grouped logically
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_API_URL}/authentication/login/`,
    FETCH_USERS: `${BASE_API_URL}/authentication/users/`,
    ROLES: `${BASE_API_URL}/authentication/roles/`,
  },

  MEMBERS: {
    CREATE: `${BASE_API_URL}/members/create/`,
    LIST: `${BASE_API_URL}/members/list/`,
    LOGIN: `${BASE_API_URL}/members/login/`,
  },

  DONATION: {
    CREATE: `${BASE_API_URL}/donation/create/`,
    LIST: `${BASE_API_URL}/donation/list/`,
  },

  ADMIN: {
    DASHBOARD: `${BASE_API_URL}/admin/dashboard/`,
    REPORTS: `${BASE_API_URL}/admin/reports/`,
  },
};
