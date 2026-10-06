import React, { useEffect, useState } from "react";
import HeroSlider from "../../components/HeroSlider";
import ChatBot from "../ChatBot/ChatBot";
import "./home.css";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";
import { mergeCategories, applyCatalog, customProductsFor } from "../../admin/adminStore";
import { LuTruck, LuShieldCheck, LuRotateCcw, LuHeadphones } from "react-icons/lu";

const perks = [
  { icon: <LuTruck />, title: "Free shipping", text: "On orders over $50" },
  { icon: <LuShieldCheck />, title: "Secure payment", text: "100% protected checkout" },
  { icon: <LuRotateCcw />, title: "Easy returns", text: "30-day return window" },
  { icon: <LuHeadphones />, title: "Friendly support", text: "We are here to help" },
];



function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    // بتجيب الأقسام المميزة الظاهرة، وبعدين منتجات كل قسم (المضافة + منتجات الـ API بعد تعديلات الأدمن) وبتشيل الأقسام الفاضية
    const fetchProducts = async () => {
      try {
        const catRes = await fetch("https://dummyjson.com/products/categories");
        const apiCats = await catRes.json();
        // Featured, visible categories (managed from the admin dashboard)
        const featured = mergeCategories(apiCats).filter(
          (c) => c.featured && !c.hidden
        );

        const results = await Promise.all(
          // لكل قسم مميز بنجيب منتجاته من الـ API (إلا لو القسم مضاف يدوي) وندمجها مع المنتجات المضافة
          featured.map(async (cat) => {
            let apiProducts = [];
            if (!cat.custom) {
              const res = await fetch(
                `https://dummyjson.com/products/category/${cat.slug}`
              );
              const data = await res.json();
              apiProducts = applyCatalog(data.products || []);
            }
            return {
              ...cat,
              items: [...customProductsFor(cat.slug), ...apiProducts],
            };
          })
        );

        const withItems = results.filter((c) => c.items.length > 0);
        setCategories(withItems);
        setProducts(Object.fromEntries(withItems.map((c) => [c.slug, c.items])));
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
          ? [0, 1, 2].map((i) => <SlideProductLoading key={i} />)
          : categories.map((category) => (
              <SlideProduct
                key={category.slug}
                data={products[category.slug]}
                title={category.name}
                slug={category.slug}
              />
            ))}
            
      </div> 
       <ChatBot />
    </PageTransition>
   
  );
}

export default Home;
