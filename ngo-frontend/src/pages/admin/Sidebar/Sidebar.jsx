import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./Sidebar.css";

// ✅ SIDEBAR LINKS CONFIG
const ADMIN_NAVS = [
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
        name: "Banners",
        path: "/admin/banners",
        icon: "fa-image",
      },
      {
        name: "Donations",
        path: "/admin/donations",
        icon: "fa-hand-holding-heart",
      },
      {
        name: "Roles",
        path: "/admin/roles",
        icon: "fa-user-shield",
      },
      {
        name: "Announcements",
        path: "/admin/announcements",
        icon: "fa-bullhorn",
      },
      {
        name: "Testimonials",
        path: "/admin/testimonials",
        icon: "fa-comment-dots",
      },
      {
        name: "Gallery",
        path: "/admin/gallery",
        icon: "fa-images",
      },
      {
        name: "Campaigns",
        path: "/admin/campaigns",
        icon: "fa-bullhorn"
      },
      {
        name: "News",
        path: "/admin/news",
        icon: "fa-newspaper"
      },
      {
        name: "Events",
        path: "/admin/events",
        icon: "fa-calendar"
      },
      {
        name: "Site Data Editor",
        path: "/admin/site-data",
        icon: "fa-database"
      },
      {
        name: "About Editor",
        path: "/admin/site-data/about",
        icon: "fa-database"
      },
      {
        name: "Mission Editor",
        path: "/admin/site-data/mission",
        icon: "fa-database"
      },
      {
        name: "Vision Editor",
        path: "/admin/site-data/vision",
        icon: "fa-database"
      },
      {
        name: "Objective Editor",
        path: "/admin/site-data/objective",
        icon: "fa-database"
      },
      {
        name: "Achievement Editor",
        path: "/admin/site-data/achievement",
        icon: "fa-database"
      },
      {
        name: "Certificates",
        path: "/admin/certificates",
        icon: "fa-certificate"
      },
      {
        name: "YouTube Videos",
        path: "/admin/youtube-videos",
        icon: "fa-youtube"
      },
    ],
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* LOGO */}
      <div className="admin-logo">
        <h4>{!collapsed ? "NGO Admin" : "NGO"}</h4>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i
          className={`fa ${collapsed ? "fa-chevron-right" : "fa-chevron-left"
            }`}
        ></i>
      </button>

      {/* USER INFO */}
      {user && !collapsed && (
        <div className="admin-user">
          <strong>{user.full_name}</strong>
          <span className="text-capitalize">{user.role?.name}</span>
        </div>
      )}

      {/* MENU */}
      <nav className="sidebar-menu">

        {ADMIN_NAVS.map((section, index) => (
          <div key={index}>

            {!collapsed && (
              <div className="menu-title">
                <small>{section.section}</small>
              </div>
            )}

            {section.items.map((item, i) => (
              <NavLink key={i} to={item.path} title={item.name}>
                <i className={`fa ${item.icon}`}></i>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}

          </div>
        ))}

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logout}>
          <i className="fa fa-right-from-bracket"></i>
          {!collapsed && <span>Logout</span>}
        </button>

      </nav>
    </aside>
  );
}
