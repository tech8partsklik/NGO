import { Link } from "react-router-dom"
import "./PageHeader.css"

export default function PageHeader({
  title = "Page Title",
  subtitle = "",
  bg = null
}) {
  return (
    <section
      className="page-header"
      style={{
        backgroundImage: bg
          ? `url(${bg})`
          : "url(https://images.unsplash.com/photo-1604328628211-16fbe597b1c4?auto=format&fit=crop&w=1600&q=80)"
      }}
    >
      <div className="page-header-overlay"></div>

      <div className="container-xl position-relative">
        <div className="page-header-content">
          <h1>{title}</h1>

          {subtitle && <p>{subtitle}</p>}

          {/* BREADCRUMB */}
          <div className="page-breadcrumb">
            <Link to="/">Home</Link>
            <span> {">"} </span>
            <span className="active">{title}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
