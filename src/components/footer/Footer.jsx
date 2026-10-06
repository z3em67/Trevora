import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import Logo from "../Logo";
import "./footer.css";

const shop = ["smartphones", "laptops", "tablets", "mobile-accessories", "sunglasses"];

// الفوتر: اللوجو وسوشيال ميديا ولينكات الأقسام وخدمة العملاء وبيانات التواصل
function Footer() {
  return (
    <footer className="site_footer">
      <div className="container footer_grid">
        <div className="footer_brand">
          <Logo />
          <p>Quality electronics and accessories, delivered with care.</p>
          <div className="socials">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="X"><FaXTwitter /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div>
          <h4>Shop</h4>
          {shop.map((c) => (
            <Link key={c} to={`/category/${c}`}>{c.replace("-", " ")}</Link>
          ))}
        </div>

        <div>
          <h4>Customer service</h4>
          <Link to="/cart">My cart</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <p><LuMail /> support@electrohub.com</p>
          <p><LuPhone /> +1 (555) 123-4567</p>
          <p><LuMapPin /> 123 Market Street</p>
        </div>
      </div>
      <div className="container footer_bottom">
        <p>© {new Date().getFullYear()} ElectroHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
