import { useSettings } from "../../context/SettingsContext";
import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const { announcement } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safe guard (still render component but nothing inside)
  const items = Array.isArray(announcement?.items)
    ? announcement.items
    : announcement?.items
    ? [announcement.items]
    : [];

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length]);

  // Move RETURN to bottom ✅
  if (!announcement?.show || items.length === 0) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <span
          dangerouslySetInnerHTML={{ __html: items[currentIndex] }}
        />
      </div>
    </div>
  );
}
