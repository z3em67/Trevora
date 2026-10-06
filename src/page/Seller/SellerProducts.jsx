import { useEffect, useState } from "react";
import "./SellerProducts.css";

const categories = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sunglasses",
];

// صفحة منتجات البائع: إضافة منتج جديد وتعديل الاسم والسعر وزيادة/تقليل المخزون ومسح المنتجات
function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("smartphones");

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Get products
  // أول ما الصفحة تفتح بنجيب المنتجات
  useEffect(() => {
    // بتجيب منتجات الأقسام من الـ API وتضيف عليها منتجات البائع المحفوظة وتشيل المحذوفة
    async function getProducts() {
      try {
        const results = await Promise.all(
          // بتجيب منتجات كل قسم من الـ API
          categories.map(async (category) => {
            const response = await fetch(`
              https://dummyjson.com/products/category/${category}
            `);

            const data = await response.json();

            return data.products;
          })
        );

        const allProducts = results.flat();

        const savedProducts =
          JSON.parse(localStorage.getItem("sellerProducts")) || [];

        const deletedProducts =
          JSON.parse(localStorage.getItem("deletedProducts")) || [];

        const filteredApiProducts = allProducts.filter(
          (product) => !deletedProducts.includes(product.id)
        );

        setProducts([
          ...savedProducts,
          ...filteredApiProducts,
        ]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  // Add Product
  // بتضيف منتج جديد: بتتأكد إن كل الخانات مكتوبة وتحفظه في الـ localStorage وفي الشاشة وتفضّي الفورم
  function handleAddProduct(e) {
    e.preventDefault();

    if (!name  ||!price  ||!stock) {
      alert("Please fill in all fields.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: name,
      price: Number(price),
      stock: Number(stock),
      category: category,
    };

    const savedProducts =
      JSON.parse(localStorage.getItem("sellerProducts")) || [];

    const updatedSavedProducts = [
      newProduct,
      ...savedProducts,
    ];

    localStorage.setItem(
      "sellerProducts",
      JSON.stringify(updatedSavedProducts)
    );

    setProducts((prevProducts) => [
      newProduct,
      ...prevProducts,
    ]);

    setName("");
    setPrice("");
    setStock("");
    setCategory("smartphones");

    alert("Product added successfully!");
  }

  // Increase Stock
  // بتزوّد مخزون المنتج واحد وتحفظ التغيير
  function increaseStock(id) {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              stock: (product.stock || 0) + 1,
            }
          : product
      );

      saveSellerProducts(updatedProducts);

      return updatedProducts;
    });
  }

  // Decrease Stock
  // بتقلّل مخزون المنتج واحد (مبتنزلش عن صفر) وتحفظ التغيير
  function decreaseStock(id) {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === id && (product.stock || 0) > 0
          ? {
              ...product,
              stock: product.stock - 1,
            }
          : product
      );

      saveSellerProducts(updatedProducts);

      return updatedProducts;
    });
  }

  // Save seller products
  // بتحفظ التعديلات في منتجات البائع المخزنة في الـ localStorage
  function saveSellerProducts(allProducts) {
    const sellerProducts =
      JSON.parse(localStorage.getItem("sellerProducts")) || [];

    const updatedSellerProducts = sellerProducts.map(
      (savedProduct) => {
        const changedProduct = allProducts.find(
          (product) => product.id === savedProduct.id
        );

        return changedProduct || savedProduct;
      }
    );

    localStorage.setItem(
      "sellerProducts",
      JSON.stringify(updatedSellerProducts)
    );
  }

  // Delete Product
  // بتمسح المنتج بعد تأكيد: بتشيله من الشاشة ومن منتجات البائع وتسجّل الـ id في المحذوفات
  function deleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }// Remove from current page
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );

    // If it is a seller-added product, remove it from localStorage
    const savedProducts =
      JSON.parse(localStorage.getItem("sellerProducts")) || [];

    const updatedSavedProducts = savedProducts.filter(
      (product) => product.id !== id
    );

    localStorage.setItem(
      "sellerProducts",
      JSON.stringify(updatedSavedProducts)
    );

    // Save deleted API product IDs
    const deletedProducts =
      JSON.parse(localStorage.getItem("deletedProducts")) || [];

    if (!deletedProducts.includes(id)) {
      deletedProducts.push(id);

      localStorage.setItem(
        "deletedProducts",
        JSON.stringify(deletedProducts)
      );
    }
  }

  // Start Edit
  // بتفتح وضع تعديل المنتج وتملا خانات الاسم والسعر بالقيم الحالية
  function startEdit(product) {
    setEditingId(product.id);
    setEditName(product.title);
    setEditPrice(product.price);
  }

  // Save Edit
  // بتحفظ الاسم والسعر الجداد للمنتج وتقفل وضع التعديل
  function saveEdit(id) {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              title: editName,
              price: Number(editPrice),
            }
          : product
      );

      saveSellerProducts(updatedProducts);

      return updatedProducts;
    });

    setEditingId(null);

    alert("Product updated successfully!");
  }

  if (loading) {
    return (
      <div className="seller_products">
        <h1>My Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="seller_products">
      <h1>My Products</h1>

      {/* Add Product */}

      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="smartphones">Smartphones</option>

          <option value="mobile-accessories">
            Mobile Accessories
          </option>

          <option value="laptops">
            Laptops
          </option>

          <option value="tablets">
            Tablets
          </option>

          <option value="sunglasses">
            Sunglasses
          </option>
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button type="submit">
          Add Product
        </button>
      </form>

      {/* Products */}

      <div className="seller_product_list">
        {products.map((product) => (
          <div
            className="seller_product_card"
            key={product.id}
          >
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt={product.title}
                width="120"
              />
            )}

            {editingId === product.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                />

                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    saveEdit(product.id)
                  }
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h3>{product.title}</h3><p>
                  Price: ${product.price}
                </p>

                <p>
                  Category: {product.category}
                </p>

                <p>
                  Stock: {product.stock ?? 0}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    startEdit(product)
                  }
                >
                  Edit
                </button>
              </>
            )}

            <div>
              <button
                type="button"
                onClick={() =>
                  decreaseStock(product.id)
                }
              >
                -
              </button>

              <span>
                {product.stock ?? 0}
              </span>

              <button
                type="button"
                onClick={() =>
                  increaseStock(product.id)
                }
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                deleteProduct(product.id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerProducts;