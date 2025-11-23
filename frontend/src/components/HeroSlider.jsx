import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const slides = [
  {
    id: 1,
    title: "Together We Can Change The World",
    subtitle: "Your support helps provide education, shelter and hope.",
    img: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 2,
    title: "Every Contribution Counts",
    subtitle: "Even a small donation can transform a life.",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 3,
    title: "Be The Change",
    subtitle: "Join us and help communities rise.",
    img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 4,
    title: "Be The Change2",
    subtitle: "Join us and help communities rise.",
    img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80"
  },
];

export default function HeroSlider() {
  const { theme } = useTheme();
  const [active, setActive] = useState(0);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goNext = () => setActive((prev) => (prev + 1) % slides.length);
  const goPrev = () => setActive((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{
            backgroundImage: `url(${slide.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
          {slides[active].title}
        </h1>

        <p className="mt-4 text-lg md:text-2xl opacity-90">
          {slides[active].subtitle}
        </p>

        <button
          className="mt-6 px-8 py-3 text-lg font-semibold rounded-full shadow-xl transition"
          style={{ backgroundColor: theme.primary }}
        >
          Donate Now
        </button>
      </div>

      {/* Controls */}
      <button
        onClick={goPrev}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition z-30"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={goNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition z-30"
      >
        <ChevronRight size={28} />
      </button>

      {/* Pagination Dots */}
      {/* <div className="absolute bottom-6 flex gap-3 z-30"> */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-30">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setActive(index)}
            className={`w-3 h-3 cursor-pointer rounded-full transition-all ${
              index === active ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
