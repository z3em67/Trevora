import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { LuHeart, LuShoppingCart } from "react-icons/lu";
import "./header.css";
import { CartContext } from "../context/CartContext";
import SerachBox from "./SerachBox";

// الهيدر العلوي: اللوجو وصندوق البحث وأيقونات المفضلة والسلة مع عدّاد العناصر
function TopHeader() {
  const { cartItems, favorites } = useContext(CartContext);

  return (
    <div className="top_header">
      <div className="container">
        <Link className="logo" to="/" aria-label="ElectroHub home">
          <Logo />
        </Link>

        <SerachBox />

        <div className="header_icons">
          <div className="icon">
            <Link to="/favorites" aria-label="Favorites">
              <LuHeart />
              {favorites.length > 0 && <span className="count">{favorites.length}</span>}
            </Link>
          </div>
          <div className="icon">
            <Link to="/cart" aria-label="Cart">
              <LuShoppingCart />
              {cartItems.length > 0 && <span className="count">{cartItems.length}</span>}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
