import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./JoinUsSection.css"

const DUMMY_JOIN = {
  show: true,
  title: "Join Hands With Us",
  description:
    "You can be a part of the change. Support our mission by donating, becoming a member or volunteering with us.",
  cards: [
    {
      icon: "fa-hand-holding-heart",
      title: "Donate",
      description:
        "Your contribution helps provide food, shelter, education and medical support.",
      link: "/donation",
      btn: "Donate Now",
    },
    {
      icon: "fa-users",
      title: "Become a Member",
      description:
        "Join our community and be a part of impactful social activities.",
      link: "/membership/apply",
      btn: "Apply Now",
    },
    {
      icon: "fa-handshake-angle",
      title: "Volunteer",
      description:
        "Give your time & skills to bring change in the lives of needy people.",
      link: "/contact",
      btn: "Volunteer Now",
    },
  ],
}

export default function JoinUsSection() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Later Connect with API / Settings
    // const load = async () => {
    //   const res = await getJoinData()
    //   setData(res)
    // }
    // load()

    setData(DUMMY_JOIN)
  }, [])

  if (!data?.show) return null

  return (
    <section className="join-section section-spacing">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>

        <div className="row g-4 mt-3">

          {data.cards.map((card, index) => (
            <div key={index} className="col-md-4">

              <div className="join-card">

                <div className="join-icon">
                  <i className={`fa-solid ${card.icon}`}></i>
                </div>

                <h5>{card.title}</h5>
                <p>{card.description}</p>

                <Link to={card.link} className="join-btn">
                  {card.btn}
                  <i className="fa-solid fa-arrow-right ms-2"></i>
                </Link>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
