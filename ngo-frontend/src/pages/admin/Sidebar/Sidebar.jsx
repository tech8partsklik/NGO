import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./Sidebar.css";

export const ADMIN_NAVS = [
  {
    section: "MAIN",
    items: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: "fa-solid fa-grip-vertical",
      },
    ],
  },

  {
    section: "MANAGEMENT",
    items: [
      {
        name: "Members",
        path: "/admin/members",
        icon: "fa-users",
      },

      {
        name: "Site Content",
        icon: "fa-database",
        submenu: [
          { name: "Site Data Editor", path: "/admin/site-data" },
          { name: "About", path: "/admin/site-data/about" },
          { name: "Mission", path: "/admin/site-data/mission" },
          { name: "Vision", path: "/admin/site-data/vision" },
          { name: "Objective", path: "/admin/site-data/objective" },
          { name: "Achievement", path: "/admin/site-data/achievement" },
        ],
      },

      {
        name: "Media",
        icon: "fa-images",
        submenu: [
          { name: "Banners", path: "/admin/banners" },
          { name: "Gallery", path: "/admin/gallery" },
          { name: "Certificates", path: "/admin/certificates" },
          { name: "YouTube Videos", path: "/admin/youtube-videos" },
        ],
      },

      {
        name: "News & Events",
        icon: "fa-newspaper",
        submenu: [
          { name: "News", path: "/admin/news" },
          { name: "Events", path: "/admin/events" },
        ],
      },

      {
        name: "System",
        icon: "fa-gear",
        submenu: [
          { name: "Roles", path: "/admin/roles" },
          { name: "Announcements", path: "/admin/announcements" },
          { name: "Testimonials", path: "/admin/testimonials" },
        ],
      },

      {
        name: "Donations",
        path: "/admin/donations",
        icon: "fa-hand-holding-heart",
      },
    ],
  },
];


export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useContext(AuthContext);


  const [openMenu, setOpenMenu] = useState(null);    // submenu toggle
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSubmenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  // For mobile
  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <aside
        className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* LOGO */}
        <div className="admin-logo">
          {!collapsed ? "NGO Admin" : "NGO"}

          {/* mobile close */}
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* TOGGLE BUTTON */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i
            className={`fa ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}
          ></i>
        </button>

        {/* USER INFO */}
        {!collapsed && (
          <div className="admin-user">
            <strong>{user.full_name}</strong>
            <span>{user.role?.name}</span>
          </div>
        )}

        {/* MENU */}
        <nav className="sidebar-menu">
          {ADMIN_NAVS.map((section, sIdx) => (
            <div key={sIdx}>
              {!collapsed && (
                <div className="menu-title">
                  <small>{section.section}</small>
                </div>
              )}

              {section.items.map((item, idx) => {
                // SUBMENU HANDLING
                if (item.submenu) {
                  const isOpen = openMenu === `${sIdx}-${idx}`;
                  return (
                    <div key={idx} className="submenu-group">
                      <div
                        className="menu-item submenu-toggle"
                        onClick={() => toggleSubmenu(`${sIdx}-${idx}`)}
                      >
                        <i className={`fa ${item.icon}`}></i>
                        {!collapsed && <span>{item.name}</span>}
                        {!collapsed && (
                          <i
                            className={`fa fa-chevron-${
                              isOpen ? "up" : "down"
                            } submenu-arrow`}
                          ></i>
                        )}
                      </div>

                      <div className={`submenu ${isOpen ? "open" : ""}`}>
                        {item.submenu.map((sub, i) => (
                          <NavLink key={i} to={sub.path} className="submenu-link">
                            {sub.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                }

                // NORMAL LINK
                return (
                  <NavLink key={idx} to={item.path} className="menu-item">
                    <i className={`fa ${item.icon}`}></i>
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* LOGOUT */}
          <button className="logout-btn" onClick={logout}>
            <i className="fa fa-right-from-bracket"></i>
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* MOBILE TOGGLE BUTTON */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <i className="fa fa-bars"></i>
      </button>
    </>
  );
}
