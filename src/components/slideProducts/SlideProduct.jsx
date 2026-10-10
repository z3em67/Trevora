import React from 'react'
import { Link } from 'react-router-dom'
import { LuArrowRight } from 'react-icons/lu'
import Product from './Product'
import './slideProduct.css'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Autoplay , Navigation } from 'swiper/modules';


function SlideProduct({data , title, slug}) {
  const canLoop = data.length > 6

  return (
    <div className='slide_products slide'>
        <div className="container">
            <div className="top_slide">
                <div>
                  <h2>{title}</h2>
                  <p>Handpicked for quality and value.</p>
                </div>
                {slug && <Link to={`/category/${slug}`} className="view_all">View all <LuArrowRight /></Link>}
            </div>

            <Swiper
              loop={canLoop}
              autoplay={canLoop ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
              spaceBetween={16}
              slidesPerView={1.6}
              breakpoints={{
                480: { slidesPerView: 2.2 },
                768: { slidesPerView: 3.2, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1360: { slidesPerView: 5, spaceBetween: 20 },
              }}
              navigation={true}
              modules={[Navigation , Autoplay]}
              className="mySwiper">
                {data.map((item) => (
                  <SwiperSlide key={item.id}> <Product item={item} /> </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </div>
  )
}

export default SlideProduct
