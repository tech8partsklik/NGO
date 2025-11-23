// Dummy Data (for now)
const DUMMY_VISION = [
  {
    title: "Our Vision",
    description:
      "To build a world where every individual has access to basic needs, education, and dignity.",
    icon: "fa-eye",
  },
  {
    title: "Our Mission",
    description:
      "To uplift underprivileged communities through education, healthcare, and sustainable development.",
    icon: "fa-hand-holding-heart",
  },
  {
    title: "Our Objectives",
    description:
      "Empower youth, promote education, ensure healthcare access and strengthen communities.",
    icon: "fa-bullseye",
  },
];

// Future API
// import api from "./api";
// import { ENDPOINTS } from "./endpoints";

export const getVisionMission = async () => {
  try {
    // const { data } = await api.get(ENDPOINTS.WEBSITE.VISION_MISSION);
    // return data;

    return DUMMY_VISION;
  } catch (error) {
    console.log("Vision API error:", error);
    return DUMMY_VISION;
  }
};
