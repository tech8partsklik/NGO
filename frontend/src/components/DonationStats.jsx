import { useEffect, useState, useRef } from "react";
import { Heart, Users, Landmark, HandHeart } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const stats = [
  { id: 1, label: "Lives Impacted", value: 15000, icon: <Users size={26} /> },
  { id: 2, label: "Meals Served", value: 340000, icon: <HandHeart size={26} /> },
  { id: 3, label: "Volunteers", value: 1200, icon: <Heart size={26} /> },
  { id: 4, label: "Schools Supported", value: 25, icon: <Landmark size={26} /> },
];

export default function DonationStats() {
  const { theme } = useTheme();
  const sectionRef = useRef(null);

  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const [started, setStarted] = useState(false);

  // Scroll Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          animateNumbers();
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, [started]);

  // Counter animation
  const animateNumbers = () => {
    const duration = 2000;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      setAnimatedValues(
        stats.map((s) => Math.floor(progress * s.value))
      );

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  return (
    <section
      ref={sectionRef}
      className="py-14 px-6 md:px-16 flex flex-col items-center transition-all"
      style={{ backgroundColor: theme.background }}
    >
      <h2
        className="text-2xl md:text-4xl font-extrabold text-center drop-shadow-md"
        style={{ color: theme.text }}
      >
        Together We Are Making an Impact ❤️
      </h2>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-10 text-center mt-12">
        {stats.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col items-center font-bold transition hover:scale-[1.04]"
          >
            <div
              className="p-4 rounded-full shadow-md"
              style={{
                backgroundColor: `${theme.primary}20`,
                color: theme.primary,
              }}
            >
              {item.icon}
            </div>

            <p className="text-4xl md:text-5xl mt-3" style={{ color: theme.primary }}>
              {animatedValues[index].toLocaleString()}
            </p>
            <p className="text-sm md:text-base opacity-70" style={{ color: theme.text }}>
              {item.label}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{
                  width: started
                    ? `${(animatedValues[index] / item.value) * 100}%`
                    : "0%",
                  backgroundColor: theme.primary,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Donation Button w/ Glow */}
      <button
        className="mt-12 px-10 py-3 text-lg font-semibold rounded-full shadow-xl animate-pulse hover:scale-105 transition-all"
        style={{
          backgroundColor: theme.primary,
          color: theme.textLight,
          animationDuration: "2.5s",
        }}
      >
        ❤️ Donate Now
      </button>

      {/* Trust Seals */}
      <div className="flex gap-6 mt-10 opacity-70 flex-wrap justify-center">
        <img src="https://trustlogos.org/img/ssl.png" className="h-10" alt="SSL Secured" />
        <img src="https://trustlogos.org/img/iso.png" className="h-10" alt="ISO Certified" />
        <img src="https://trustlogos.org/img/govt.png" className="h-10" alt="Government Registered" />
        <img src="https://trustlogos.org/img/ngo.png" className="h-10" alt="Verified NGO" />
      </div>
    </section>
  );
}
