import api from "./api";
import { ENDPOINTS } from "./endpoints";
import { 
  setToken, 
  setRefreshToken, 
  setUser 
} from "../utils/storage";

export const loginUser = async (payload) => {
  const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);

  if (data?.access && data?.refresh) {
    setToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data.user);
  }

  return data.user;
};
