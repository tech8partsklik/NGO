import { useTheme } from "../../hooks/useTheme";

const posts = [
  { title: "Medical Camp Successfully Completed", date: "Feb 2025", img: "https://picsum.photos/400/240" },
  { title: "New Education Center Opened", date: "Jan 2025", img: "https://picsum.photos/401/241" },
  { title: "Food Distribution Drive Reached 1200 Families", date: "Dec 2024", img: "https://picsum.photos/402/242" },
];

export default function LatestNews() {
  const { theme } = useTheme();

  return (
    <section className="py-16 px-6 md:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center" style={{ color: theme.text }}>
        Latest Updates
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {posts.map((post, i) => (
          <div key={i} className="rounded-xl shadow-md overflow-hidden hover:scale-105 transition cursor-pointer">
            <img src={post.img} className="w-full h-48 object-cover" />
            <div className="p-5">
              <p className="text-sm opacity-70">{post.date}</p>
              <h3 className="text-lg font-bold mt-2" style={{ color: theme.text }}>
                {post.title}
              </h3>
              <button className="mt-3 font-medium text-sm underline">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
