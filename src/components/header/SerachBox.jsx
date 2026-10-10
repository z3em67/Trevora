import React, { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SerachBox() {
  const [serachTerm, setSerachTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const boxRef = useRef(null);

  const handleSbumit = (e) => {
    e.preventDefault();
    if (serachTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(serachTerm.trim())}`);
    }
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!serachTerm.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${serachTerm}`);
        const data = await res.json();
        setSuggestions(data.products.slice(0, 5) || []);
      } catch (error) {
        console.error("Search Error :", error);
        setSuggestions([]);
      }
    };
    const debonuce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debonuce);
  }, [serachTerm]);

  useEffect(() => {
    setSuggestions([]);
  }, [location]);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setSuggestions([]);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="serachBox_Contaienr" ref={boxRef}>
      <form onSubmit={handleSbumit} className="search_box" role="search">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for products"
          aria-label="Search for products"
          value={serachTerm}
          onChange={(e) => setSerachTerm(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" aria-label="Search">
          <LuSearch />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item) => (
            <li key={item.id}>
              <Link to={`/products/${item.id}`}>
                <img src={item.images[0]} alt="" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SerachBox;
