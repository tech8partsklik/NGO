import { useTheme } from "../../hooks/useTheme";
 
export default function AboutSection() {
  const { theme } = useTheme();

  return (
    <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
      
      {/* Left Image */}
      <div className="md:w-1/2">
        <img 
          src="/aman_jan.webp"
          alt="NGO helping"
          className="rounded-2xl shadow-xl object-cover w-full"
        />
      </div>

      {/* Right Text */}
      <div className="md:w-1/2">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme.text }}>
          Our Story
        </h2>
        <p className="text-base md:text-lg leading-relaxed opacity-80" style={{ color: theme.text }}>
          Founded with a simple belief — that every human deserves dignity, love, education, 
          and opportunity — our organization has grown from a small group of volunteers 
          to a global movement of changemakers.
        </p>

        <p className="mt-4 text-base md:text-lg opacity-70" style={{ color: theme.text }}>
          Today, we work across multiple regions improving access to education, healthcare, food security, 
          women empowerment, and sustainable community development.
        </p>

        <button
          className="mt-6 px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
          style={{ backgroundColor: theme.primary, color: theme.textLight }}
        >
          Learn More →
        </button>
      </div>
    </section>
  );
}
