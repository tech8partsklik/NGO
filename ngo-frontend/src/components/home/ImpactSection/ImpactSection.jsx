import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "./ImpactSection.css";

// Later this will come from API
// import { getImpactStats } from "../../../services/impact.service";

const DUMMY_IMPACTS = [
  { title: "Meals Served", value: 25000, icon: "fa-bowl-food" },
  { title: "Students Educated", value: 1200, icon: "fa-graduation-cap" },
  { title: "Families Helped", value: 800, icon: "fa-people-roof" },
  { title: "Volunteers", value: 150, icon: "fa-handshake-angle" },
];

export default function ImpactSection() {
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔜 Future API
        // const data = await getImpactStats()

        setImpacts(DUMMY_IMPACTS);
      } catch {
        setImpacts(DUMMY_IMPACTS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Animate numbers
  useEffect(() => {
    if (!impacts.length) return;

    const intervals = impacts.map((item, index) => {
      let start = 0;
      const end = item.value;
      const duration = 2000;
      const increment = Math.ceil(end / (duration / 30));

      return setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(intervals[index]);
        }

        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = start;
          return updated;
        });
      }, 30);
    });

    return () => intervals.forEach((i) => clearInterval(i));
  }, [impacts]);

  /* ================= SKELETON ================= */
  if (loading) {
    return (
      <section className="impact-section">
        <div className="container-xl">
          <div className="section-heading text-center">
            <Skeleton width={200} height={30} />
            <div style={{ marginTop: "0.5rem" }}>
              <Skeleton width={300} height={20} />
            </div>
          </div>

          <div className="row g-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-md-3 col-sm-6">
                <div className="impact-card text-center p-4">
                  <Skeleton circle width={60} height={60} />
                  <div className="mt-3">
                    <Skeleton height={35} />
                  </div>
                  <Skeleton width="70%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="impact-section">
      <div className="container-xl">

        {/* ✅ Reusable heading */}
        <div className="section-heading text-center">
          <h2>Our Impact So Far</h2>
          <p>Every number represents a life we touched</p>
        </div>

        <div className="row g-4 mt-4">
          {impacts.map((item, index) => (
            <div key={index} className="col-md-3 col-sm-6">
              <div className="impact-card text-center">

                <div className="impact-icon">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>

                <h3 className="impact-number">
                  {counts[index] || 0}+
                </h3>

                <p className="impact-title">
                  {item.title}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
