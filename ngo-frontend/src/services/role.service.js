import api from "./api";
import { ENDPOINTS } from "./endpoints";

// GET ALL ROLES
export const getAllRoles = async () => {
  const { data } = await api.get(ENDPOINTS.ROLES.LIST);
  return data;
};

// ADD ROLE
export const addRole = async (payload) => {
  const { data } = await api.post(ENDPOINTS.ROLES.ADD, payload);
  return data;
};

// UPDATE ROLE
export const updateRole = async (payload) => {
  const { data } = await api.post(ENDPOINTS.ROLES.UPDATE, payload);
  return data;
};

// DELETE ROLE
export const deleteRole = async (payload) => {
  const { data } = await api.delete(ENDPOINTS.ROLES.DELETE, {
    data: payload, // axios requires "data" key for DELETE body
  });
  return data;
};
