// src/services/news.service.js

import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const getAllNews = async (payload) => {
  const { data } = await api.post(ENDPOINTS.NEWS.LIST, payload);
  return data;
};

export const addNews = async (payload) => {
  const { data } = await api.post(ENDPOINTS.NEWS.ADD, payload);
  return data;
};

export const updateNews = async (payload) => {
  const { data } = await api.post(ENDPOINTS.NEWS.UPDATE, payload);
  return data;
};

export const deleteNews = async (payload) => {
  const { data } = await api.delete(ENDPOINTS.NEWS.DELETE, { data: payload });
  return data;
};
