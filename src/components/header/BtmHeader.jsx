import React, { useEffect, useRef, useState } from "react";
import {
  LuLayoutGrid,
  LuChevronDown,
  LuMenu,
  LuX,
  LuLogIn,
  LuUserPlus,
  LuUserRound
} from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
 
 
  { title: "Contact", link: "/contact" },
];

function BtmHeader() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    setIsCategoryOpen(false);
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setIsCategoryOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setIsCategoryOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div className={`btm_header ${isMenuOpen ? "menu_open" : ""}`}>
      <div className="container">
        <nav className="nav">
          <div className={`category_nav ${isCategoryOpen ? "open" : ""}`} ref={categoryRef}>
            <button
              type="button"
              className="category_btn"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <LuLayoutGrid />
              <p>Browse Category</p>
              <LuChevronDown />
            </button>

            <div className={`category_nav_list ${isCategoryOpen ? "active" : ""}`}>
              {categories.map((category) => (
                <Link key={category.slug} to={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="menu_toggle"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <LuX /> : <LuMenu />}
          </button>

          <ul className="nav_links">
            {NavLinks.map((item) => (
              <li key={item.link} className={location.pathname === item.link ? "active" : ""}>
                <Link to={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
<div className="sign_regs_icon">

  <Link to="/login">
    <LuLogIn /> Sign in
  </Link>

  <Link to="/register">
    <LuUserPlus /> Register
  </Link>

  <Link to="/profile" className="profile_icon">
    <LuUserRound />
  </Link>

</div>
      </div>
    </div>
  );
}

export default BtmHeader;
