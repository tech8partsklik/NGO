import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "./VideoSection.css"

import { useSettings } from "../../../context/SettingsContext"

const DUMMY_VIDEOS = {
  show: true,
  title: "Our Work in Action",
  subtitle: "Watch how we transform lives",
  items: [
    {
      title: "Education for All",
      video_id: "ysz5S6PUM-U",
    },
    {
      title: "Food Drive 2024",
      video_id: "ScMzIvxBSi4",
    },
    {
      title: "Health Camp",
      video_id: "dQw4w9WgXcQ",
    },
  ]
}

export default function VideoSection() {
  const { videos } = useSettings()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (videos?.show && videos?.items?.length > 0) {
      setData(videos)
    } else {
      setData(DUMMY_VIDEOS)
    }
    setLoading(false)
  }, [videos])

  if (!data?.show) return null

  if (loading) {
    return (
      <section className="section-spacing">
        <div className="container-xl">
          <Skeleton height={40} width="35%" style={{ marginBottom: "2rem" }} />
          <div className="row g-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="col-md-4">
                <Skeleton height={220} borderRadius={16} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="video-section section-spacing">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>{data.title || "Our Work in Action"}</h2>
          <p>{data.subtitle || "Watch how we transform lives"}</p>
        </div>

        <div className="row g-4 mt-3">

          {data.items.map((item, i) => (
            <div key={i} className="col-md-6 col-lg-4">

              <div className="video-card">
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.video_id}`}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <h6>{item.title}</h6>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}
