import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import Skeleton from "react-loading-skeleton";

import { getHeroBanners } from "../../services/banner.service";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch banners from service ✅
  useEffect(() => {
    const loadBanners = async () => {
      const data = await getHeroBanners();
      setBanners(data);
      setLoading(false);
    };

    loadBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [banners]);

  // ✅ SKELETON LOADING VIEW
  if (loading) {
    return (
      <section className="ngo-hero">
        <div className="hero-bg">
          <Skeleton height="100%" width="100%" />
        </div>

        <div className="hero-overlay" />

        <div className="container-xl hero-content">
          <Skeleton width="30%" height={20} />
          <div style={{ margin: "1rem 0" }}>
            <Skeleton width="60%" height={50} />
          </div>
          <Skeleton width="50%" height={25} />
          <div style={{ marginTop: "1.5rem" }}>
            <Skeleton width={160} height={50} borderRadius={40} />
          </div>
        </div>
      </section>
    );
  }

  if (!banners.length) return null;

  const active = banners[current];

  return (
    <section className="ngo-hero">
      {/* IMAGE */}
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url(${
            active.image ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80"
          })`,
        }}
      />

      {/* OVERLAY */}
      <div className="hero-overlay" />

      {/* CONTENT */}
      <div className="container-xl hero-content">
        <p className="hero-subtitle">{active.subtitle}</p>
        <h1 className="hero-title">{active.title}</h1>
        <p className="hero-desc">{active.description}</p>

        {active.button_text && (
          <Link to={active.button_link} className="hero-btn">
            {active.button_text}
          </Link>
        )}
      </div>

      {/* SLIDER DOTS */}
      <div className="hero-dots">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
}
