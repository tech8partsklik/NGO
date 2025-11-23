import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "./Mission.css"

// Later connect with API
// import { getMission } from "../../../services/vision.service"

const DUMMY_MISSION = {
    title: "Our Mission",
    description:
        "To uplift underprivileged communities by providing access to education, healthcare, food and resources required for a dignified life.",
    image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
}

export default function Mission() {
    const [mission, setMission] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                // const data = await getMission()
                setMission(DUMMY_MISSION)
            } catch {
                setMission(DUMMY_MISSION)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    if (loading) {
        return (
            <section className="mission-section">
                <div className="container-xl">
                    <div className="row align-items-center g-5">
                        <div className="col-md-6">
                            <Skeleton height={300} />
                        </div>
                        <div className="col-md-6">
                            <Skeleton height={40} width="60%" />
                            <Skeleton count={3} style={{ marginTop: "1rem" }} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="mission-section">
            <div className="container-xl">
                <div className="row align-items-center g-5">

                    <div className="col-md-6">
                        <img src={mission.image} alt="mission" className="mission-img" />
                    </div>

                    <div className="col-md-6">
                        <div className="section-heading">
                            <h2>{mission.title}</h2>
                            <p>Our purpose & commitment</p>
                        </div>

                        <p className="mission-text">
                            {mission.description}
                        </p>

                        {/* MISSION POINTS */}
                        <ul className="mission-points">
                            <li><i className="fa-solid fa-check"></i> Accessible education for all</li>
                            <li><i className="fa-solid fa-check"></i> Medical camps & food programs</li>
                            <li><i className="fa-solid fa-check"></i> Skill development for youth</li>
                            <li><i className="fa-solid fa-check"></i> Empowering rural communities</li>
                        </ul>

                        {/* STATS */}
                        <div className="mission-stats">
                            <div>
                                <h3>1200+</h3>
                                <span>Children Helped</span>
                            </div>
                            <div>
                                <h3>85+</h3>
                                <span>Volunteers</span>
                            </div>
                            <div>
                                <h3>50+</h3>
                                <span>Projects</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mission-btn-wrap">
                            <a href="/about" className="mission-btn">Learn More</a>
                            <a href="/donation" className="mission-btn outline">Donate Now</a>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    )
}
