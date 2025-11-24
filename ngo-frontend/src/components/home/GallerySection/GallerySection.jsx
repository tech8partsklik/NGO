import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "./GallerySection.css";

import { useSettings } from "../../../context/SettingsContext";

const DUMMY_GALLERY = {
  show: true,
  style: 2, // 1 = only image , 2 = image + text
  items: [
    {
      image:
        "https://images.unsplash.com/photo-1581574203213-00058f14b61c?auto=format&fit=crop&w=800&q=80",
      title: "Education Drive",
      description: "Helping underprivileged children with books",
    },
    {
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
      title: "Food Distribution",
      description: "Serving meals to homeless people",
    },
    {
      image:
        "https://images.unsplash.com/photo-1459180129673-eefb56f79b45?auto=format&fit=crop&w=800&q=80",
      title: "Medical Camp",
      description: "Providing free health services",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      title: "Women Empowerment",
      description: "Skill development for rural women",
    },
  ],
};

export default function GallerySection() {
  const { gallery } = useSettings();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (gallery?.show && gallery?.items?.length > 0) {
      setData(gallery);
    } else {
      setData(DUMMY_GALLERY);
    }
  }, [gallery]);

  if (!data?.show) return null;

  return (
    <section className="home-gallery section-spacing">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>Our Gallery</h2>
          <p>Glimpse of our work in action</p>
        </div>

        <div className="row g-4">

          {data.items.map((item, index) => (

            <div key={index} className="col-md-6 col-lg-3">

              {data.style === 1 ? (
                // ✅ IMAGE ONLY
                <div className="gallery-image-only">
                  <img src={item.image} alt="gallery" />
                </div>
              ) : (
                // ✅ IMAGE + TEXT
                <div className="gallery-card">
                  <img src={item.image} alt="gallery" />

                  <div className="gallery-content">
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                  </div>
                </div>
              )}

            </div>

          ))}

        </div>
      </div>
    </section>
  );
}
