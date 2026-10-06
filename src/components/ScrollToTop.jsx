import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// كومبوننت مالوش شكل: كل ما الصفحة (المسار) تتغير بيطلّع السكرول لفوق خالص
function ScrollToTop() {
    
    const { pathname} = useLocation();


    // بيشتغل كل ما الـ pathname يتغير ويرجّع الصفحة لأول نقطة
    useEffect(() => {
        window.scrollTo({
            top: 0,
            // behavior: "smooth"
        })
    }, [pathname])

  return null
}

export default ScrollToTop