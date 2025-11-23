import { useEffect, useState } from "react";
import "./VisionSection.css";
import Skeleton from "react-loading-skeleton";
import { getVisionMission } from "../../../services/vision.service";

export default function VisionSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getVisionMission();
      setItems(data);
      setLoading(false);
    };

    loadData();
  }, []);

  /* ✅ Skeleton Loading UI */
  if (loading) {
    return (
      <section className="vision-section">
        <div className="container-xl">

          {/* GLOBAL SECTION HEADING */}
          <div className="section-heading text-center">
            <Skeleton width={250} height={30} />
            <div style={{ marginTop: "0.5rem" }}>
              <Skeleton width={180} height={15} />
            </div>
          </div>

          <div className="row mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="vision-card p-4 text-center">
                  <Skeleton circle width={70} height={70} />
                  <div className="mt-3">
                    <Skeleton width="60%" height={20} />
                  </div>
                  <div className="mt-2">
                    <Skeleton count={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="vision-section">
      <div className="container-xl">

        {/* ✅ GLOBAL SECTION HEADING */}
        <div className="section-heading text-center">
          <h2>Our Vision, Mission & Objectives</h2>
          <p>What drives us every single day</p>
        </div>

        <div className="row mt-5">
          {items.map((item, i) => (
            <div key={i} className="col-md-4 mb-4">

              <div className="vision-card">

                <div className="vision-icon">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
