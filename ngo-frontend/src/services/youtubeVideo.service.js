// youtubeVideo.service.js
import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const addYouTubeVideo = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.ADD_YOUTUBE_VIDEO,
    payload
  );
  return data;
};

export const updateYouTubeVideo = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.SITE_CREDENTIAL.UPDATE_YOUTUBE_VIDEO,
    payload
  );
  return data;
};

export const getYouTubeVideos = async () => {
  const { data } = await api.get(
    ENDPOINTS.SITE_CREDENTIAL.GET_YOUTUBE_VIDEOS
  );
  return data;
};

export const deleteYouTubeVideo = async (id) => {
  const { data } = await api.delete(
    `${ENDPOINTS.SITE_CREDENTIAL.DELETE_YOUTUBE_VIDEO}?id=${id}`
  );
  return data;
};
