import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      
      <section className="about-hero">
        <h1>About ElectroHub</h1>
        <p>Your trusted destination for electronics</p>
      </section>

      <section className="about-content">
        <div className="about-text">
          <h2>Who We Are</h2>

          <p>
            Welcome to ElectroHub, your online destination for
            electronics and smart devices.
          </p>

          <p>
            We offer a wide range of electronic products including
            mobile phones, laptops, headphones, smart watches,
            accessories, and more.
          </p>

          <p>
            Our goal is to make buying electronics easier and more
            convenient by providing a simple shopping experience,
            different products, and competitive prices.
          </p>
        </div>

        <div className="about-box">
          <h2>Why Choose Us?</h2>

          <div className="about-item">
            <h3>Wide Range</h3>
            <p>Different electronics and accessories in one place.</p>
          </div>

          <div className="about-item">
            <h3>Easy Shopping</h3>
            <p>Find and order your favorite products easily.</p>
          </div>

          <div className="about-item">
            <h3>Competitive Prices</h3>
            <p>Great products at reasonable prices.</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>What We Offer</h2>

        <div className="category-container">

          <div className="category-card">
            <h3> Mobile Phones</h3>
            <p>Latest smartphones and mobile devices.</p>
          </div>

          <div className="category-card">
            <h3> Laptops</h3>
            <p>Laptops and computers for different needs.</p>
          </div>

          <div className="category-card">
            <h3> Headphones</h3>
            <p>Headphones and speakers for great sound.</p>
          </div>

          <div className="category-card">
            <h3> Smart Watches</h3>
            <p>Smart watches and wearable devices.</p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default About;