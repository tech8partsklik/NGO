import axios from "axios";
import { 
  getToken, 
  getRefreshToken, 
  setToken, 
  clearStorage 
} from "../utils/storage";
import { BASE_API_URL, ENDPOINTS } from "./endpoints";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
});

// -------------------- REQUEST --------------------
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- RESPONSE --------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If Access token expired -> Try refresh
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();

      if (refresh) {
        try {
          const { data } = await axios.post(
            ENDPOINTS.AUTH.ROTATE_TOKEN,
            { refresh }
          );

          if (data?.access) {
            setToken(data.access);

            originalRequest.headers.Authorization =
              `Bearer ${data.access}`;

            return api(originalRequest);
          }
        } catch (err) {
          clearStorage();
          window.location.href = "/admin/login";
        }
      } else {
        clearStorage();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
