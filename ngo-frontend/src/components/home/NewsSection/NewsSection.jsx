import { Link } from "react-router-dom"
import "./NewsSection.css"

const DUMMY_NEWS = [
  {
    title: "Free Health Camp Organized",
    date: "12 August 2025",
    img: "https://www.bec.org/wp-content/uploads/2024/08/VZG260824-1.jpg",
  },
  {
    title: "New Education Program Launched",
    date: "2 September 2025",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    title: "Food Distribution Drive",
    date: "18 October 2025",
    img: "https://www.snehdhara.org/wp-content/uploads/2025/02/food-distribution-1.jpg",
  },
]

export default function NewsSection() {
  return (
    <section className="news-section">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>Latest News</h2>
          <p>What’s happening in our NGO</p>
        </div>

        <div className="row g-4">
          {DUMMY_NEWS.map((news, i) => (
            <div key={i} className="col-md-4">
              <div className="news-card">
                <img src={news.img} alt={news.title} />
                <div className="news-body">
                  <span>{news.date}</span>
                  <h5>{news.title}</h5>
                  <Link to="/news">Read More →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
