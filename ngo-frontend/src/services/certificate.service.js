import api from "./api";
import { ENDPOINTS } from "./endpoints";

// ADD NEW CERTIFICATE
export const addCertificate = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.ADD_CERTIFICATE,
    payload
  );
  return data;
};

// LIST ALL CERTIFICATES (optional param: id)
export const listCertificates = async (params = {}) => {
  const { data } = await api.get(
    ENDPOINTS.SITE_CREDENTIAL.LIST_CERTIFICATES,
    { params }
  );
  return data;
};

// UPDATE CERTIFICATE
export const updateCertificate = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_CERTIFICATE,
    payload
  );
  return data;
};

// DELETE CERTIFICATE
export const deleteCertificate = async (pk) => {
  const { data } = await api.delete(
    ENDPOINTS.SITE_CREDENTIAL.DELETE_CERTIFICATE,
    { data: { pk } }
  );
  return data;
};
