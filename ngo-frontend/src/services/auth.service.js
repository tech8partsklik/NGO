import api from "./api"
import { ENDPOINTS } from "./endpoints"

// === LOGIN ===
export const loginUser = async (payload) => {
  const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload)
  return data
}

export const fetchUsers = async (payload) => {
  const { data } = await api.post(ENDPOINTS.AUTH.FETCH_USERS, payload)
  return data
}

export const fetchRoles = async (payload) => {
  const { data } = await api.get(ENDPOINTS.AUTH.ROLES, {
    params: payload,
  })
  return data
}

export const addRole = async (payload) => {
  const { data } = await api.post(ENDPOINTS.AUTH.ROLES, payload)
  return data
}

export const updateRole = async (payload) => {
  const { data } = await api.put(ENDPOINTS.AUTH.ROLES, payload)
  return data
}
