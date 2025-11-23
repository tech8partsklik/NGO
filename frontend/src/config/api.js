export const API_BASE_URL = "http://localhost:8000/api";

export const endpoints = {
  login: `${API_BASE_URL}/auth/login/`,
  register: `${API_BASE_URL}/auth/register/`,
  donations: `${API_BASE_URL}/donations/`,
  campaigns: `${API_BASE_URL}/campaigns/`,
};
