const images = [
    "https://picsum.photos/seed/a/400/300",
    "https://picsum.photos/seed/b/400/300",
    "https://picsum.photos/seed/c/400/300",
    "https://picsum.photos/seed/d/400/300",
  ];
  
  export default function GalleryPreview() {
    return (
      <section className="py-16 px-6 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Gallery</h2>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {images.map((img, i) => (
            <img key={i} src={img} className="rounded-xl w-full h-40 object-cover shadow-lg" />
          ))}
        </div>
  
        <button className="mt-6 underline font-medium">View Full Gallery →</button>
      </section>
    );
  }
  