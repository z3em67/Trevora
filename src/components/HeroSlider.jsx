import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay , Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { getBanners } from '../admin/adminStore';
import { DEFAULT_BANNERS, resolveImg } from '../admin/defaultBanners';

function HeroSlider() {
  const slides = (getBanners() || DEFAULT_BANNERS).filter((b) => b.active);
  if (slides.length === 0) return null;
  return (
    <section className="hero">
      <div className="container">
        <Swiper
          loop={slides.length > 1}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          modules={[Pagination , Autoplay]}
          className="hero_swiper"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.id}>
              <div className="hero_slide">
                <div className="content">
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <Link to={s.to} className="btn btn-lg">Shop Now <LuArrowRight /></Link>
                </div>
                <img src={resolveImg(s.img)} alt={s.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default HeroSlider;
