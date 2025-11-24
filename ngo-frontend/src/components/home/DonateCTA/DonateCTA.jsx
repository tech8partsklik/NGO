import { Link } from "react-router-dom"
import "./DonateCTA.css"

const DUMMY_DONATE = {
  show: true,
  title: "Your Small Help Can Make A Big Change",
  description:
    "Every donation you make supports food, education and medical care for underprivileged people. One step from you can change many lives.",
  image:
    "https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&w=1600&q=80",
}

export default function DonateCTA() {

  if (!DUMMY_DONATE.show) return null

  return (
    <section
      className="donate-cta section-spacing"
      style={{ backgroundImage: `url(${DUMMY_DONATE.image})` }}
    >
      <div className="donate-overlay"></div>

      <div className="container-xl position-relative">
        <div className="donate-box">

          <span className="donate-tag">
            <i className="fa-solid fa-heart"></i> Support a Cause
          </span>

          <h2>{DUMMY_DONATE.title}</h2>

          <p>{DUMMY_DONATE.description}</p>

          <div className="donate-actions">

            {/* ✅ STATIC DONATION ROUTE */}
            <Link to="/donation" className="donate-btn-main">
              <i className="fa-solid fa-hand-holding-heart"></i>
              Donate Now
            </Link>

            {/* ✅ MEMBERSHIP APPLY ROUTE */}
            <Link to="/membership/apply" className="donate-btn-outline">
              <i className="fa-solid fa-users"></i>
              Become a Member
            </Link>

          </div>

        </div>
      </div>
    </section>
  )
}
