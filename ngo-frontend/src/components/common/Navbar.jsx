import { Link, NavLink } from "react-router-dom"
import { useContext, useState } from "react"
import "./Navbar.css"

import { AuthContext } from "../../context/AuthContext"
import { useSettings } from "../../context/SettingsContext"

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { site, navbar, loading } = useSettings()

  const [open, setOpen] = useState(false)

  if (loading) return null

  return (
    <header className="ngo-header">

      {/* ================= TOP BAR ================= */}
      <div className="top-bar">
        <div className="container-xl top-inner">

          {/* LEFT - CONTACT */}
          <div className="top-contact">

            {site?.email && (
              <a href={`mailto:${site.email}`}>
                <i className="fa-solid fa-envelope"></i>
                {site.email}
              </a>
            )}

            {site?.phone && (
              <a href={`tel:${site.phone}`}>
                <i className="fa-solid fa-phone"></i>
                {site.phone}
              </a>
            )}

          </div>


          {/* RIGHT - ACTIONS */}
          <div className="top-actions">

            {navbar?.roles?.manager_login && (
              <Link to="/manager/login" className="login-link">
                Manager Login
              </Link>
            )}

            {navbar?.roles?.coordinator_login && (
              <Link to="/coordinator/login" className="login-link">
                Coordinator Login
              </Link>
            )}

            {site?.donate_url && (
              <a
                href={site.donate_url}
                target="_blank"
                className="donate-btn"
              >
                <i className="fa-solid fa-hand-holding-heart"></i>
                Donate Now
              </a>
            )}

            {!user ? (
              <Link to="/admin/login" className="login-link">
                Admin Login
              </Link>
            ) : (
              <button onClick={logout} className="logout-link">
                Logout
              </button>
            )}

          </div>
        </div>
      </div>


      {/* ================= MAIN NAVBAR ================= */}
      <div className="main-navbar">
        <div className="container-xl nav-inner">

          {/* LOGO */}
          <Link to="/" className="logo-area">
            {site?.logo && (
              <img src={site.logo} alt={site?.name} />
            )}
            <h2>{site?.name || "NGO FOUNDATION"}</h2>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="desktop-menu">

            {navbar?.menus?.map((menu, index) => (
              <div key={index} className="menu-item">

                <NavLink to={menu.url}>
                  {menu.name}
                  {menu.children && <i className="fa fa-chevron-down"></i>}
                </NavLink>

                {/* SUB MENU */}
                {menu.children && (
                  <div className="submenu">
                    {menu.children.map((sub, i) => (
                      <NavLink key={i} to={sub.url}>
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

          </nav>

          {/* MOBILE TOGGLE */}
          <div
            className="mobile-toggle"
            onClick={() => setOpen(!open)}
          >
            <i className="fa-solid fa-bars"></i>
          </div>

        </div>
      </div>


      {/* ================= MOBILE DRAWER MENU ================= */}
      <div className={`mobile-menu ${open ? "show" : ""}`}>

        <div className="mobile-close" onClick={() => setOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>

        {navbar?.menus?.map((menu, index) => (
          <div key={index} className="mobile-item">

            <NavLink onClick={() => setOpen(false)} to={menu.url}>
              {menu.name}
            </NavLink>

            {menu.children && (
              <div className="mobile-submenu">
                {menu.children.map((sub, i) => (
                  <NavLink
                    onClick={() => setOpen(false)}
                    key={i}
                    to={sub.url}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}

          </div>
        ))}

      </div>

    </header>
  )
}
