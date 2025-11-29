// services/campaign.service.js
import api from "./api";
import { ENDPOINTS } from "./endpoints";

// LIST - POST
export const getAllCampaigns = async (payload) => {
  const { data } = await api.post(ENDPOINTS.CAMPAIGN.LIST, payload);
  return data;
};

// ADD - POST (FormData)
export const addCampaign = async (payload) => {
  const { data } = await api.post(ENDPOINTS.CAMPAIGN.ADD, payload);
  return data;
};

// UPDATE - POST (FormData)
export const updateCampaign = async (payload) => {
  const { data } = await api.post(ENDPOINTS.CAMPAIGN.UPDATE, payload);
  return data;
};

// DELETE - DELETE
export const deleteCampaign = async (payload) => {
  const { data } = await api.delete(ENDPOINTS.CAMPAIGN.DELETE, { data: payload });
  return data;
};
