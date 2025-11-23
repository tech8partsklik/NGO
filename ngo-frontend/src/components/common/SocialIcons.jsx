import { useSettings } from "../../context/SettingsContext";

export default function SocialIcons() {
  const { social_links, loading } = useSettings();

  if (loading) return null;

  return (
    <>
      {/* WHATSAPP */}
      {social_links?.whatsapp && (
        <a
          href={`https://wa.me/${social_links.whatsapp}`}
          target="_blank"
          className="social-float whatsapp-float"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
      )}

      {/* FACEBOOK */}
      {social_links?.facebook && (
        <a
          href={social_links.facebook}
          target="_blank"
          className="social-float facebook-float"
        >
          <i className="fa-brands fa-facebook-f"></i>
        </a>
      )}

      {/* INSTAGRAM */}
      {social_links?.instagram && (
        <a
          href={social_links.instagram}
          target="_blank"
          className="social-float instagram-float"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
      )}

      {/* TWITTER (X) */}
      {social_links?.twitter && (
        <a
          href={social_links.twitter}
          target="_blank"
          className="social-float twitter-float"
        >
          <i className="fa-brands fa-x-twitter"></i>
        </a>
      )}

      {/* YOUTUBE */}
      {social_links?.youtube && (
        <a
          href={social_links.youtube}
          target="_blank"
          className="social-float youtube-float"
        >
          <i className="fa-brands fa-youtube"></i>
        </a>
      )}

      {/* LINKEDIN (optional but recommended) */}
      {social_links?.linkedin && (
        <a
          href={social_links.linkedin}
          target="_blank"
          className="social-float linkedin-float"
        >
          <i className="fa-brands fa-linkedin-in"></i>
        </a>
      )}
    </>
  );
}
