import { useTheme } from "../../hooks/useTheme";

const leaders = [
  { name: "Rahul Sharma", role: "Founder & Director", img: "https://randomuser.me/api/portraits/men/11.jpg" },
  { name: "Aisha Khan", role: "Head of Operations", img: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Dr. Karan Patel", role: "Medical Outreach Lead", img: "https://randomuser.me/api/portraits/men/15.jpg" },
  { name: "Rahul Sharma", role: "Founder & Director", img: "https://randomuser.me/api/portraits/men/11.jpg" },
  { name: "Aisha Khan", role: "Head of Operations", img: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Dr. Karan Patel", role: "Medical Outreach Lead", img: "https://randomuser.me/api/portraits/men/15.jpg" }
];

export default function LeadershipSection() {
  const { theme } = useTheme();

  return (
    <section className="py-16 px-6 md:px-16 text-center">
      <h2 className="text-3xl md:text-4xl font-bold" style={{ color: theme.text }}>
        Meet Our Leadership
      </h2>

      <div className="grid md:grid-cols-3 gap-10 mt-12">
        {leaders.map((leader, i) => (
          <div key={i} className="p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <img
              src={leader.img}
              className="w-28 h-28 mx-auto rounded-full object-cover border-4 shadow-md"
            />
            <h3 className="mt-4 font-bold text-xl" style={{ color: theme.text }}>{leader.name}</h3>
            <p className="opacity-60" style={{ color: theme.text }}>{leader.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
