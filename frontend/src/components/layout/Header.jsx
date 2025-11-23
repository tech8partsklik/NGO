import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, cycleTheme } = useTheme();

  const navigate = useNavigate();

  const goToDonate = () => {
    navigate("/donate");
  };
  const navItems = [
    { label: "About", link: "/about" },
    { label: "become a member", link: "/become-member" },
    { label: "Gallery", link: "/gallery" },
    { label: "Contact", link: "/contact" },
  ];

  return (
    <header
      className="shadow-md sticky top-0 backdrop-blur-lg bg-white/80 z-50"
      style={{ backgroundColor: theme.primary }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo */}
        <h1 className="font-extrabold text-2xl text-white" >
        HopeBridge Foundation
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.link}
              className="font-medium hover:text-gray-700 text-white"
            >
              {item.label}
            </a>
          ))}

          <button
            className="px-4 py-2 rounded-md font-semibold text-white transition"
            style={{ backgroundColor: theme.primary }}
            onClick={goToDonate}
          >
            Donate
          </button>

          {/* <button
            onClick={cycleTheme}
            className="border px-3 py-1 rounded-md font-medium"
          >
            🎨 Theme
          </button> */}

        <button
            className="px-4 py-2 rounded-md font-semibold text-white transition"
            style={{ backgroundColor: theme.primary }}
          >
            Login
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-3 px-6 pb-6">
          {navItems.map((item) => (
            <a key={item.label} href={item.link} className="py-2 border-b">
              {item.label}
            </a>
          ))}

          <button
            style={{ backgroundColor: theme.primary }}
            className="px-4 py-2 text-white rounded-lg"
          >
            Donate
          </button>

          <button
            onClick={cycleTheme}
            className="border px-3 py-2 rounded-md"
          >
            🎨 Change Theme
          </button>
        </div>
      )}
    </header>
  );
}
