import api from "./api";

export const createOrder = async (amount) => {
  const response = await api.post("donations/create-order/", { amount });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post("donations/verify-payment/", paymentData);
  return response.data;
};
