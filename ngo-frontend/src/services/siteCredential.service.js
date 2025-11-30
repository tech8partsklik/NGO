import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const getSiteCredential = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET);
  return data;
};



// ====================== GET SITE DATA ======================
export const getSiteData = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET_SITE_DATA);
  return data;
};

// ====================== UPDATE SITE DATA ======================
export const updateSiteData = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_SITE_DATA,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
  return data;
};






// ---- ABOUT ----
export const getAboutData = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET_ABOUT_DATA);
  return data;
};

export const updateAboutData = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_ABOUT_DATA,
    payload
  );
  return data;
};



// ---- MISSION ----
export const getMissionData = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET_MISSION_DATA);
  return data;
};

export const updateMissionData = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_MISSION_DATA,
    payload
  );
  return data;
};

// ---- VISION ----
export const getVisionData = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET_VISION_DATA);
  return data;
};

export const updateVisionData = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_VISION_DATA,
    payload
  );
  return data;
};






// ---- OBJECTIVE ----
export const getObjectiveData = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET_OBJECTIVE_DATA);
  return data;
};

export const updateObjectiveData = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_OBJECTIVE_DATA,
    payload
  );
  return data;
};

// ---- ACHIEVEMENT ----
export const getAchievementData = async () => {
  const { data } = await api.get(ENDPOINTS.SITE_CREDENTIAL.GET_ACHIVEMENT_DATA);
  return data;
};

export const updateAchievementData = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_ACHIVEMENT_DATA,
    payload
  );
  return data;
};
