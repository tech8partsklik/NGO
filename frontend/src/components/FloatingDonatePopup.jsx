import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const POPUP_DELAY = 3000;      // Show after 3 seconds
const POPUP_TIMEOUT = 10 * 60 * 1000; // 10 minutes in ms

export default function FloatingDonatePopup() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("donation_popup_last");

    // If already shown in last 10 minutes -> don't show
    if (lastShown && Date.now() - Number(lastShown) < POPUP_TIMEOUT) {
      return;
    }

    // Show after delay
    const timer = setTimeout(() => {
      setVisible(true);
      localStorage.setItem("donation_popup_last", Date.now().toString());
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 max-w-[300px] sm:max-w-[350px] 
      bg-white shadow-2xl rounded-xl p-5 z-50 border transform 
      animate-[fadeInUp_0.6s_ease]"
    >
      {/* Close Button */}
      <button className="absolute top-2 right-2" onClick={() => setVisible(false)}>
        <X size={18} className="opacity-70 hover:opacity-100" />
      </button>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
        🌍 Make a Difference
      </h3>

      {/* Text */}
      <p className="text-sm sm:text-base opacity-70 leading-relaxed">
        Even a small contribution can feed a child today. Your kindness matters ❤️
      </p>

      {/* CTA */}
      <button
        className="mt-4 w-full py-2 text-sm sm:text-lg font-semibold rounded-full shadow-lg 
        hover:scale-105 transition-all"
        style={{ backgroundColor: theme.primary, color: theme.textLight }}
      >
        Donate Now 💖
      </button>
    </div>
  );
}
