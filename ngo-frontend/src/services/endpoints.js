export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.61:8000/api"; // HOME
// export const BASE_API_URL =
//   import.meta.env.VITE_API_URL || "http://192.168.1.18:8000/api";  // OFFICE

export const BASE_WS_URL =
  import.meta.env.VITE_WS_URL || "ws://192.168.1.32:8000";

export const BASE_MEDIA_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.61:8000";

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
  LIST: `${BASE_API_URL}/banners/get-banners/`,
  DELETE: `${BASE_API_URL}/banners/delete-banner/`,
};

// ====================== ROLES =====================
ENDPOINTS.ROLES = {
  LIST: `${BASE_API_URL}/roles/get-roles/`,
  ADD: `${BASE_API_URL}/roles/add-role/`,
  UPDATE: `${BASE_API_URL}/roles/update-role/`,
  DELETE: `${BASE_API_URL}/roles/delete-role/`,
};

// ====================== ANNOUNCEMENT =====================
ENDPOINTS.ANNOUNCEMENT = {
  LIST: `${BASE_API_URL}/announcements/get-announcements/`, // GET 
  ADD: `${BASE_API_URL}/announcements/add-announcement/`,  // POST
  UPDATE: `${BASE_API_URL}/announcements/update-announcement/`,  // POST
  DELETE: `${BASE_API_URL}/announcements/delete-announcement/`,  // DELETE
};

// ====================== TESTIMONIALS =====================
ENDPOINTS.TESTIMONIALS = {
  LIST: `${BASE_API_URL}/testimonials/get-testimonials/`, // POST 
  ADD: `${BASE_API_URL}/testimonials/add-testimonial/`,  // POST
  UPDATE: `${BASE_API_URL}/testimonials/update-testimonial/`,  // POST
  DELETE: `${BASE_API_URL}/testimonials/delete-testimonial/`,  // DELETE
};


// ====================== SITE CREDENTIAL =====================
ENDPOINTS.SITE_CREDENTIAL = {
  GET: `${BASE_API_URL}/sitecredential/`, // GET request without params
  GET_ADMIN: `${BASE_API_URL}/get-credentials-for-admin/`,  // GET request without params
  UPDATE: `${BASE_API_URL}/site-data/update-credentials/`,  // POST
};

// ====================== DONATION =====================
ENDPOINTS.DONATION = {
  CREATE_ORDER: `${BASE_API_URL}/donations/create-order/`,
  VERIFY_PAYMENT: `${BASE_API_URL}/donations/verify-payment/`,
  LIST: `${BASE_API_URL}/donation/list/`,
};

// ====================== ADMIN ========================
ENDPOINTS.ADMIN = {
  DASHBOARD: `${BASE_API_URL}/admin/dashboard/`,
  REPORTS: `${BASE_API_URL}/admin/reports/`,
};
