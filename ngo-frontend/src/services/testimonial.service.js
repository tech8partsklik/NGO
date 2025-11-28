// services/testimonial.service.js
import api from "./api";
import { ENDPOINTS } from "./endpoints";

// LIST - POST
export const getAllTestimonials = async (payload) => {
  const { data } = await api.post(ENDPOINTS.TESTIMONIALS.LIST, payload);
  return data;
};

// ADD
export const addTestimonial = async (payload) => {
  const { data } = await api.post(ENDPOINTS.TESTIMONIALS.ADD, payload);
  return data;
};

// UPDATE
export const updateTestimonial = async (payload) => {
  const { data } = await api.post(ENDPOINTS.TESTIMONIALS.UPDATE, payload);
  return data;
};

// DELETE
export const deleteTestimonial = async (payload) => {
  const { data } = await api.delete(ENDPOINTS.TESTIMONIALS.DELETE, {
    data: payload
  });
  return data;
};
