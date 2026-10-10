import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./productdetails.css";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import ProductDetailsLoading from "./ProductDetailsLoading";
import SlideProductLoading from "../../components/slideProducts/SlideProductLoading";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import PageTransition from "../../components/PageTransition";
import { getCustomProducts, applyCatalog, customProductsFor } from "../../admin/adminStore";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Products added from the admin dashboard live in localStorage
        const own = getCustomProducts().find((p) => String(p.id) === String(id));
        if (own) {
          setProduct(own);
          return;
        }
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data.images ? applyCatalog([data])[0] || null : null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    fetch(`https://dummyjson.com/products/category/${product.category}`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedProducts([
          ...customProductsFor(product.category),
          ...applyCatalog(data.products || []),
        ]);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingRelatedProducts(false));
  }, [product?.category]);


  if (loading) return <ProductDetailsLoading />;
  if (!product) return <div className="container"><div className="empty_state"><h2>Product not found</h2><p>We could not find the product you are looking for.</p></div></div>;

  return (
    <PageTransition key={id}>

<div>
      {loading ? (
        <ProductDetailsLoading />
      ) : (
        <div className="item_details">
          <div className="container">
            <ProductImages product={product} />
            <ProductInfo product={product} />
          </div>
        </div>
      )}

      {loadingRelatedProducts ? (
        <SlideProductLoading />
      ) : (
        <SlideProduct
          key={product.category}
          data={relatedProducts.filter((p) => p.id !== product.id)}
          title={product.category.replace("-", " ")}
          slug={product.category}
        />
      )}
    </div>

    </PageTransition>
  );
}

export default ProductDetails;
