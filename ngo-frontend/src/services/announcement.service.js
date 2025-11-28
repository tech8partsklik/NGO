import api from "./api";
import { ENDPOINTS } from "./endpoints";

// GET ALL
export const getAllAnnouncements = async () => {
  const { data } = await api.get(ENDPOINTS.ANNOUNCEMENT.LIST);
  return data;
};

// ADD
export const addAnnouncement = async (payload) => {
  const { data } = await api.post(ENDPOINTS.ANNOUNCEMENT.ADD, payload);
  return data;
};

// UPDATE
export const updateAnnouncement = async (payload) => {
  const { data } = await api.post(ENDPOINTS.ANNOUNCEMENT.UPDATE, payload);
  return data;
};

// DELETE
export const deleteAnnouncement = async (pk) => {
  const { data } = await api.delete(ENDPOINTS.ANNOUNCEMENT.DELETE, {
    data: { pk },
  });

  return data;
};
