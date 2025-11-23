// src/services/banner.service.js
import api from "./api";
import { ENDPOINTS } from "./endpoints";

/**
 * 👇 Dummy fallback data (if API not available)
 */
const DUMMY_BANNERS = [
  {
    id: 1,
    title: "Together We Can Change Lives",
    subtitle: "Helping the needy since 2012",
    description:
      "Join us in making the world a better place for underprivileged communities.",
    image:
      "https://images.unsplash.com/photo-1609125705767-e41d61480f9c?auto=format&fit=crop&w=1600&q=80",
    button_text: "Donate Now",
    button_link: "/donation",
  },
  {
    id: 2,
    title: "Be The Reason Someone Smiles",
    subtitle: "Your support matters",
    description:
      "Every small contribution counts and brings hope to someone in need.",
    image:
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1350&q=80",
    button_text: "Join Now",
    button_link: "/membership",
  },
  {
    id: 3,
    title: "Education For Every Child",
    subtitle: "Let knowledge shine",
    description:
      "Support our mission of educating children from underserved backgrounds.",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1350&q=80",
    button_text: "See Programs",
    button_link: "/about",
  },
];

export const getHeroBanners = async () => {
  try {
    const { data } = await api.get(
      ENDPOINTS?.WEBSITE?.BANNERS || "/website/banners"
    );

    // If API returns data → use it
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    // else fallback
    return DUMMY_BANNERS;
  } catch (error) {
    console.warn("Banner API failed, using dummy data");
    return DUMMY_BANNERS;
  }
};
