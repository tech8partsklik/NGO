import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"
import "./TestimonialSection.css"

// later we can connect api
// import { getTestimonials } from "../../../services/testimonial.service"

const DUMMY_TESTIMONIALS = {
  show: true,
  items: [
    {
      name: "Rahul Sharma",
      role: "Volunteer",
      message:
        "Working with this NGO has completely changed my perspective on life. The impact they create is real and inspiring.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Anjali Verma",
      role: "Donator",
      message:
        "I am proud to support this organization. Every rupee donated is used with honesty and transparency.",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      name: "Amit Singh",
      role: "Member",
      message:
        "The team is highly dedicated. I’ve seen how lives are being transformed every single day.",
      image: "https://randomuser.me/api/portraits/men/34.jpg",
    },
    {
      name: "Neha Kapoor",
      role: "Supporter",
      message:
        "If you are looking for a genuine NGO to support, this is the one. Truly inspiring work!",
      image: "https://randomuser.me/api/portraits/women/35.jpg",
    },
  ],
}

export default function TestimonialSection() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // later from api
    // const load = async () => {
    //   const res = await getTestimonials()
    //   setData(res)
    // }
    // load()

    setData(DUMMY_TESTIMONIALS)
  }, [])

  if (!data?.show) return null

  return (
    <section className="testimonial-section section-spacing">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>What People Say</h2>
          <p>Real stories from our supporters & volunteers</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={2}
          loop={true}
          centeredSlides={true}
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            992: { slidesPerView: 2 },
          }}
          className="testimonial-swiper"
        >
          {data.items.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">

                <div className="testimonial-top">
                  <div className="testimonial-img">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="testimonial-info">
                    <h5>{item.name}</h5>
                    <span>{item.role}</span>
                  </div>
                </div>

                <div className="testimonial-message">
                  <i className="fa-solid fa-quote-left"></i>
                  <p>{item.message}</p>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  )
}
