import React from "react";
import "./Contact.css";

// صفحة التواصل: بيانات المتجر وفورم رسالة (شكل بس، مش بيبعت حاجة لسه)
function Contact() {
  return (
    <div className="contact-page">

      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </section>

      <section className="contact-content">

        <div className="contact-info">
          <h2>Get In Touch</h2>

          <p>
            Have a question about our products or your order?
            Feel free to contact us.
          </p>

          <div className="contact-item">
            <h3>Email</h3>
            <p>support@electrohub.com</p>
          </div>

          <div className="contact-item">
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>

          <div className="contact-item">
            <h3>Address</h3>
            <p>123 Market Street</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>

          <form>
            <input
              type="text"
              placeholder="Your Name"
            />

            <input
              type="email"
              placeholder="Your Email"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              placeholder="Your Message"
              rows="6"
            ></textarea>

            <button type="submit">
              Send Message
            </button>
          </form>
        </div>

      </section>

    </div>
  );
}

export default Contact;