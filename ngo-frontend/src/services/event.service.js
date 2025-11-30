// src/services/news.service.js

import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const getAllEvents = async (payload) => {
  const { data } = await api.post(ENDPOINTS.EVENT.LIST, payload);
  return data;
};

export const addEvent = async (payload) => {
  const { data } = await api.post(ENDPOINTS.EVENT.ADD, payload);
  return data;
};

export const updateEvent = async (payload) => {
  const { data } = await api.post(ENDPOINTS.EVENT.UPDATE, payload);
  return data;
};

export const deleteEvent = async (payload) => {
  const { data } = await api.delete(ENDPOINTS.EVENT.DELETE, { data: payload });
  return data;
};
