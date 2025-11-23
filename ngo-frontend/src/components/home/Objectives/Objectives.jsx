import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "./Objectives.css"

const DUMMY_OBJECTIVES = [
  { icon: "fa-book", text: "Provide education to underprivileged children" },
  { icon: "fa-hand-holding-medical", text: "Offer free healthcare camps" },
  { icon: "fa-bowl-food", text: "Distribute food & ration kits" },
  { icon: "fa-people-group", text: "Empower community livelihood" }
]

export default function Objectives() {
  const [objectives, setObjectives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setObjectives(DUMMY_OBJECTIVES)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <section className="objectives-section">
        <div className="container-xl">
          <Skeleton height={35} width="30%" />
          <div className="row g-4 mt-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="col-md-3">
                <Skeleton height={150} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="objectives-section">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>Our Objectives</h2>
          <p>Steps towards a better tomorrow</p>
        </div>

        <div className="row g-4">
          {objectives.map((item, index) => (
            <div key={index} className="col-md-3 col-sm-6">
              <div className="objective-card">
                <i className={`fa-solid ${item.icon}`}></i>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
