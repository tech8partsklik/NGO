import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./MembersCarousel.css";

// import { getMembersList } from "../../../services/member.service";

const FALLBACK_MEMBERS = [
  { name: "Amit Sharma", role: "Founder", img: "https://randomuser.me/api/portraits/men/10.jpg" },
  { name: "Riya Verma", role: "Coordinator", img: "https://randomuser.me/api/portraits/women/11.jpg" },
  { name: "Rahul Singh", role: "Volunteer", img: "https://randomuser.me/api/portraits/men/12.jpg" },
  { name: "Neha Kapoor", role: "Teacher", img: "https://randomuser.me/api/portraits/women/13.jpg" },
];

export default function MembersCarousel() {
  const [members, setMembers] = useState(FALLBACK_MEMBERS || []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await getMembersList();
//         setMembers(data?.length ? data : FALLBACK_MEMBERS);
//       } catch {
//         setMembers(FALLBACK_MEMBERS);
//       }
//     };
//     load();
//   }, []);

  if (!members.length) return null;

  return (
    <section className="member-section">
      <div className="container-xl">

        <div className="section-heading text-center">
          <h2>Our Team</h2>
          <p>The people behind the mission</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500 }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1100: { slidesPerView: 3 },
          }}
          className="team-swiper"
        >
          {members.map((m, i) => (
            <SwiperSlide key={i}>
              <div className="member-card">

                <div className="member-img">
                  <img src={m.img} alt={m.name} />

                  {/* Socials on hover */}
                  {/* <div className="member-socials">
                    <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
                    <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                  </div> */}
                </div>

                <h5>{m.name}</h5>
                <p>{m.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
