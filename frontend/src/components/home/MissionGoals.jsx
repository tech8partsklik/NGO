import { CheckCircle } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const missions = [
  "Education for every child",
  "Healthcare access for all",
  "Women empowerment programs",
  "Food & shelter support",
  "Environmental protection initiatives",
];

export default function MissionGoals() {
  const { theme } = useTheme();

  return (
    <section className="py-16 px-6 md:px-16 text-center"
      style={{ backgroundColor: theme.backgroundSecondary }}>
      
      <h2 className="text-3xl md:text-4xl font-bold" style={{ color: theme.text }}>
        Our Mission & Goals
      </h2>

      <p className="mt-4 max-w-2xl mx-auto opacity-70" style={{ color: theme.text }}>
        We aim to create long-term, sustainable positive impact across communities with compassion, transparency, and dedication.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto">
        {missions.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-3 p-4 rounded-xl shadow hover:scale-105 transition"
            style={{ backgroundColor: theme.card }}
          >
            <CheckCircle size={22} style={{ color: theme.primary }} />
            <span className="font-medium" style={{ color: theme.text }}>{m}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
