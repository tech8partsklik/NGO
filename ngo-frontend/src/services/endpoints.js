export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.32:8000/api";

export const BASE_WS_URL =
  import.meta.env.VITE_WS_URL || "ws://192.168.1.32:8000";

export const ENDPOINTS = {};

// ====================== AUTH ========================
ENDPOINTS.AUTH = {
  LOGIN: `${BASE_API_URL}/auth/login/`,
  ROTATE_TOKEN: `${BASE_API_URL}/auth/rotate-token/`,              // refresh token
  UPDATE_SELF_PASSWORD: `${BASE_API_URL}/auth/update-self-password/`,
  UPDATE_MEMBER_PASSWORD: `${BASE_API_URL}/auth/update-member-password/`,
  PROFILE: `${BASE_API_URL}/auth/profile/`,
};

// ====================== MEMBERS =====================
ENDPOINTS.MEMBERS = {
  CREATE: `${BASE_API_URL}/members/become-member/`,
  LIST: `${BASE_API_URL}/members/get-members/`,
  APPROVE: `${BASE_API_URL}/members/approve-member/`,
  BLOCK: `${BASE_API_URL}/members/block-member/`,
  ADD: `${BASE_API_URL}/members/add-member/`,
  UPDATE_MEMBER_DETAIL: `${BASE_API_URL}/members/update-member-detail/`,
  UPDATE_SELF_DETAIL: `${BASE_API_URL}/members/update-self-detail/`,
};

// ====================== BANNERS =====================
ENDPOINTS.BANNERS = {
  ADD: `${BASE_API_URL}/banners/add-banner/`,
  UPDATE: `${BASE_API_URL}/banners/update-banner/`,
  LIST: `${BASE_API_URL}/banners/get-banner/`,
  DELETE: `${BASE_API_URL}/banners/delete-banner/`,
};

// ====================== DONATION =====================
ENDPOINTS.DONATION = {
  CREATE: `${BASE_API_URL}/donation/create/`,
  LIST: `${BASE_API_URL}/donation/list/`,
};

// ====================== ADMIN ========================
ENDPOINTS.ADMIN = {
  DASHBOARD: `${BASE_API_URL}/admin/dashboard/`,
  REPORTS: `${BASE_API_URL}/admin/reports/`,
};
