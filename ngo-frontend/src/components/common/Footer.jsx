import { Link } from "react-router-dom"
import "./Footer.css"
import { useSettings } from "../../context/SettingsContext"

export default function Footer() {
  const { site, footer, social_links, navbar, loading } = useSettings()

  if (loading) return null

  // FIND MENUS FROM NAVBAR
  const aboutMenu = navbar?.menus?.find(m => m.name === "About Us")
  const membershipMenu = navbar?.menus?.find(m => m.name === "Membership")

  const quickLinks = navbar?.menus?.filter(
    m => ["Home", "Donation", "Gallery", "News", "Contact"].includes(m.name)
  )

  return (
    <footer className="ngo-footer">

      <div className="footer-top">
        <div className="container-xl footer-grid">

          {/* ========== ABOUT COLUMN ========== */}
          <div className="footer-col">
            <div className="footer-logo">
              {site?.logo && <img src={site.logo} alt={site?.name} />}
              <h3>{site?.name || "Helping Hands NGO"}</h3>
            </div>

            <p className="footer-about">{footer?.about}</p>

            <div className="footer-socials">
              {social_links?.facebook && (
                <a href={social_links.facebook} target="_blank">
                  <i className="fa-brands fa-facebook-f" />
                </a>
              )}

              {social_links?.instagram && (
                <a href={social_links.instagram} target="_blank">
                  <i className="fa-brands fa-instagram" />
                </a>
              )}

              {social_links?.twitter && (
                <a href={social_links.twitter} target="_blank">
                  <i className="fa-brands fa-x-twitter" />
                </a>
              )}

              {social_links?.linkedin && (
                <a href={social_links.linkedin} target="_blank">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              )}

              {social_links?.youtube && (
                <a href={social_links.youtube} target="_blank">
                  <i className="fa-brands fa-youtube" />
                </a>
              )}
            </div>
          </div>


          {/* ========== QUICK LINKS (FROM NAVBAR) ========== */}
          <div className="footer-col">
            <h4>Quick Links</h4>

            {quickLinks?.map((item, i) => (
              <Link key={i} to={item.url}>
                {item.name}
              </Link>
            ))}

            {/* Membership submenu */}
            {membershipMenu?.children?.map((sub, i) => (
              <Link key={`m-${i}`} to={sub.url}>
                {sub.name}
              </Link>
            ))}
          </div>


          {/* ========== IMPORTANT LINKS (FROM NAVBAR) ========== */}
          <div className="footer-col">
            <h4>Important Links</h4>

            {aboutMenu?.children?.map((item, i) => (
              <Link key={`a-${i}`} to={item.url}>
                {item.name}
              </Link>
            ))}
          </div>


          {/* ========== CONTACT ========= */}
          <div className="footer-col">
            <h4>Contact Us</h4>

            {site?.email && (
              <p>
                <i className="fa-solid fa-envelope" />
                {site.email}
              </p>
            )}

            {site?.phone && (
              <p>
                <i className="fa-solid fa-phone" />
                {site.phone}
              </p>
            )}

            {site?.address && (
              <p>
                <i className="fa-solid fa-location-dot" />
                {site.address}
              </p>
            )}

            {/* {site?.donate_url && (
              <a
                href={site.donate_url}
                target="_blank"
                className="footer-donate"
              >
                <i className="fa-solid fa-hand-holding-heart"></i>
                Donate Now
              </a>
            )} */}
          </div>

        </div>
      </div>


      {/* ========== BOTTOM ========== */}
      <div className="footer-bottom">
        <div className="container-xl footer-bottom-inner">

          <p>© {new Date().getFullYear()} {site?.name}. All Rights Reserved.</p>

          <p>
            Designed & Developed by <span>{site?.name}</span>
          </p>

        </div>
      </div>

    </footer>
  )
}
