import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import SlideProductLoading from "../components/slideProducts/SlideProductLoading";
import Product from "../components/slideProducts/Product";
import { applyCatalog } from "../admin/adminStore";

// صفحة نتايج البحث: بتاخد كلمة البحث من الرابط وتعرض المنتجات المطابقة
function SearchResults() {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("query");

  const [loading, setLoading] = useState(true);

  // كل ما كلمة البحث تتغير بنجيب النتايج من جديد
  useEffect(() => {
    // بتبعت طلب البحث للـ API وتطبّق تعديلات الأدمن على النتايج
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${query}`
        );
        const data = await res.json();
        setResults(applyCatalog(data.products || []));
      } catch (error) {
        console.error("Search Error :", error);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query]);

  return (
    <PageTransition key={query}>
      <div className="category_products">
        {loading ? (
          <SlideProductLoading key={query} />
        ) : results.length > 0 ? (
           
                <div className="container">
                  <div className="top_slide">
                    <div><h2>Results for “{query}”</h2><p>{results.length} products found</p></div>
                  </div>
      
                  <div className="products">
                    {results.map((item, index) => (
                      <Product item={item} key={index} />
                    ))}
                  </div>
                </div>
            
        ) : <div className="container"><div className="empty_state"><h2>No results found</h2><p>Try a different keyword or browse our categories.</p></div></div>}
      </div>
    </PageTransition>
  );
}

export default SearchResults;
