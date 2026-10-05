import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../../components/slideProducts/Product";
import "./categorypage.css";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";
import { applyCatalog, customProductsFor } from "../../admin/adminStore";

function CategoryPage() {
  const { category } = useParams();

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        const products = [
          ...customProductsFor(category),
          ...applyCatalog(data.products || []),
        ];
        setCategoryProducts({ products, total: products.length });
      })
      .catch(() => {
        const products = customProductsFor(category);
        setCategoryProducts({ products, total: products.length });
      })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <PageTransition key={category}>
        <div className="category_products">
      {loading ? (
        <SlideProductLoading key={category} />
      ) : (
        <div className="container">
          <div className="top_slide">
            <div>
              <h2>{category.replace(/-/g, " ")}</h2>
              <p>{categoryProducts.total} products</p>
            </div>
          </div>

          <div className="products">
            {categoryProducts.products.map((item, index) => (
              <Product item={item} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
}

export default CategoryPage;
