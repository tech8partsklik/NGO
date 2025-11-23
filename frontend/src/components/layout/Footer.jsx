import { useTheme } from "../../hooks/useTheme";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="mt-20 text-center py-10 text-white"
      style={{ backgroundColor: theme.primary }}
    >
      <h3 className="font-bold text-xl tracking-wide">NGO Name</h3>
      <p className="mt-2 text-sm opacity-80">Together we create change.</p>

      <p className="mt-6 text-sm opacity-70">
        © {new Date().getFullYear()} All Rights Reserved
      </p>
    </footer>
  );
}
