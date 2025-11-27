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



//  ADD MEMBER (FormData)
export const addMember = async (formData) => {
  const { data } = await api.post(ENDPOINTS.MEMBERS.ADD, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};



// UPDATE MEMBER (FormData)
export const updateMember = async (formData) => {
  const { data } = await api.post(
    ENDPOINTS.MEMBERS.UPDATE_MEMBER_DETAIL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data;
};

