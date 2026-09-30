import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay , Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import bannerHero1 from '../img/banner_Hero1.jpg';
import bannerHero2 from '../img/banner_Hero2.jpg';
import bannerHero3 from '../img/banner_Hero3.jpg';

const slides = [
  { eyebrow: "Introducing the new", title: "Microsoft Xbox 360 Controller", text: "Windows Xp/10/7/8 Ps3, Tv Box", img: bannerHero1, to: "/category/mobile-accessories" },
  { eyebrow: "New arrival", title: "Wireless Bluetooth Speaker", text: "Rich, room-filling sound in a compact design.", img: bannerHero2, to: "/category/smartphones" },
  { eyebrow: "Just landed", title: "Portable Music Player", text: "Your playlists, always in your pocket.", img: bannerHero3, to: "/category/tablets" },
];

function HeroSlider() {
  return (
    <section className="hero">
      <div className="container">
        <Swiper
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          modules={[Pagination , Autoplay]}
          className="hero_swiper"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.title}>
              <div className="hero_slide">
                <div className="content">
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <Link to={s.to} className="btn btn-lg">Shop Now <LuArrowRight /></Link>
                </div>
                <img src={s.img} alt={s.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default HeroSlider;
