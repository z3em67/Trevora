import React, { useEffect, useState } from "react";
import HeroSlider from "../../components/HeroSlider";
import ChatBot from "../ChatBot/ChatBot";
import "./home.css";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";
import { LuTruck, LuShieldCheck, LuRotateCcw, LuHeadphones } from "react-icons/lu";

const perks = [
  { icon: <LuTruck />, title: "Free shipping", text: "On orders over $50" },
  { icon: <LuShieldCheck />, title: "Secure payment", text: "100% protected checkout" },
  { icon: <LuRotateCcw />, title: "Easy returns", text: "30-day return window" },
  { icon: <LuHeadphones />, title: "Friendly support", text: "We are here to help" },
];

const categories = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sunglasses",
  
];

function Home() {
  const [products, setProducts] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(
              `https://dummyjson.com/products/category/${category}`
            );
            const data = await res.json();
            return { [category]: data.products };
          })
        );

        const productsData = Object.assign({}, ...results);
        setProducts(productsData);
      } catch (error) {
        console.error("Erorr Fetching", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <PageTransition>
      <div>
        <HeroSlider />

        <div className="container perks">
          {perks.map((p) => (
            <div className="perk" key={p.title}>
              {p.icon}
              <div><h4>{p.title}</h4><p>{p.text}</p></div>
            </div>
          ))}
        </div>

        {loading
          ? categories.map((category) => <SlideProductLoading key={category} />)
          : categories.map((category) => (
              <SlideProduct
                key={category}
                data={products[category]}
                title={category.replace("-", " ")}
                slug={category}
              />
            ))}
            
      </div> 
       <ChatBot />
    </PageTransition>
   
  );
}

export default Home;
