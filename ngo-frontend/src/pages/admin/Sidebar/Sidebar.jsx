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
