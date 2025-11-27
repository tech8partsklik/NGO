import api from "./api";
import { ENDPOINTS } from "./endpoints";

// ✅ GET ALL MEMBERS
export const getAllMembers = async (payload = {}) => {
  const { data } = await api.post(ENDPOINTS.MEMBERS.LIST, {
    search: "",
    page_number: 1,
    page_size: 25,
    ids: [],
    account_status: "",
    ...payload,
  });

  return data;
};

// ✅ APPROVE MEMBER
export const approveMember = async (id) => {
  const { data } = await api.post(ENDPOINTS.MEMBERS.APPROVE, {
    user_pk: id
  });

  return data;
};

// ✅ BLOCK MEMBER
export const blockMember = async (id) => {
  const { data } = await api.post(ENDPOINTS.MEMBERS.BLOCK, {
    user_pk: id
  });

  return data;
};
