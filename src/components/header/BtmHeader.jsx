import React, { useEffect, useRef, useState } from "react";
import {
  LuLayoutGrid,
  LuChevronDown,
  LuMenu,
  LuX,
  LuLogIn,
  LuUserPlus,
  LuUserRound,
} from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { visibleCategories } from "../../admin/adminStore";

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },

  { title: "Contact", link: "/contact" },
  { title: "Orders", link: "/orders" },
];

// الهيدر السفلي: قايمة الأقسام، لينكات الصفحات، وأزرار الدخول/التسجيل/الخروج/الأدمن/البروفايل
function BtmHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // حالة تسجيل الدخول: true لو في مستخدم متخزن في الـ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("currentUser")
);
  // دالة بتتنفذ على طول وبتشوف لو المستخدم الحالي role بتاعه admin (عشان نظهر زرار الأدمن)
  const isAdminUser = (() => {
    try { return JSON.parse(localStorage.getItem("currentUser"))?.role === "admin"; }
    catch { return false; }
  })();
  const categoryRef = useRef(null);

 

  // كل ما الصفحة تتغير: بنقفل قايمة الأقسام والمنيو وبنحدّث حالة تسجيل الدخول
  useEffect(() => {
  setIsCategoryOpen(false);
  setIsMenuOpen(false);

  setIsLoggedIn(!!localStorage.getItem("currentUser"));
}, [location]);
  // بنجيب الأقسام من الـ API (مرة واحدة) وبنخبّي اللي الأدمن مخبّيه
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(visibleCategories(data)))
      .catch((error) => console.error(error));
  }, []);


  useEffect(() => {
    // بتقفل قايمة الأقسام لو الضغطة كانت برّا القايمة
    const close = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setIsCategoryOpen(false);
    };
    // بتقفل قايمة الأقسام لما يضغط زرار Escape
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
          <div
            className={`category_nav ${isCategoryOpen ? "open" : ""}`}
            ref={categoryRef}
          >
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

            <div
              className={`category_nav_list ${isCategoryOpen ? "active" : ""}`}
            >
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
              <li
                key={item.link}
                className={location.pathname === item.link ? "active" : ""}
              >
                <Link to={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
       <div className="sign_regs_icon">
  {!isLoggedIn ? (
    <>
      <Link to="/login">
        <LuLogIn /> Sign in
      </Link>

      <Link to="/register">
        <LuUserPlus /> Register
      </Link>
    </>
  ) : (
 <button
  className="logout_btn"
  onClick={() => {
    // تسجيل الخروج: بنمسح المستخدم من الـ localStorage ونحدّث الحالة ونرجّعه للصفحة الرئيسية
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    alert("Logout successful");
    navigate("/");
  }}
>
  Logout
</button>
  )}

  {isAdminUser && <Link to="/admin">Admin</Link>}

  <Link to="/profile" className="profile_icon">
    <LuUserRound />
  </Link>
</div>
      </div>
    </div>
  );
}

export default BtmHeader;
