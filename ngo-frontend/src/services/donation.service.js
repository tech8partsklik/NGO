import api from "./api";
import { ENDPOINTS } from "./endpoints";

// CREATE ORDER
export const createDonationOrder = async (payload) => {
  const { data } = await api.post(ENDPOINTS.DONATION.CREATE_ORDER, payload);
  return data;
};

// VERIFY PAYMENT
export const verifyDonationPayment = async (payload) => {
  const { data } = await api.post(ENDPOINTS.DONATION.VERIFY_PAYMENT, payload);
  return data;
};




export const getAllDonations = async (payload) => {
    const { data } = await api.post(
        ENDPOINTS.DONATION.ALL_DONATION_HISTORY,
        payload
    );
    return data;
};
