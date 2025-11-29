// services/gallery.service.js
import api from "./api";
import { ENDPOINTS } from "./endpoints";

// LIST (POST)
export const getAllGallery = async (payload) => {
  const { data } = await api.post(ENDPOINTS.GALLERY.LIST, payload);
  return data;
};

// ADD
export const addGallery = async (payload) => {
  const { data } = await api.post(ENDPOINTS.GALLERY.ADD, payload);
  return data;
};

// UPDATE
export const updateGallery = async (payload) => {
  const { data } = await api.post(ENDPOINTS.GALLERY.UPDATE, payload);
  return data;
};

// DELETE
export const deleteGallery = async (payload) => {
  const { data } = await api.delete(ENDPOINTS.GALLERY.DELETE, {
    data: payload
  });
  return data;
};
