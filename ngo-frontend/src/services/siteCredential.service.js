import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const getSiteCredential = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET);
  return data;
};
