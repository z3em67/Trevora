import { useEffect, useState } from "react";
import "./SellerProducts.css";

const categories = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sunglasses",
];

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("smartphones");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    async function getProducts() {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const response = await fetch(
             ` https://dummyjson.com/products/category/${category}
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

  function handleAddProduct(e) {
    e.preventDefault();

    if (!name || !price||  !stock) {
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

  function deleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );const savedProducts =
      JSON.parse(localStorage.getItem("sellerProducts")) || [];

    const updatedSavedProducts = savedProducts.filter(
      (product) => product.id !== id
    );

    localStorage.setItem(
      "sellerProducts",
      JSON.stringify(updatedSavedProducts)
    );

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

  function startEdit(product) {
    setEditingId(product.id);
    setEditName(product.title);
    setEditPrice(product.price);
  }

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
          <option value="smartphones">
            Smartphones
          </option>

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
{/* Products */}

<div className="seller_product_list">

  {/* Table Header */}

  <div className="seller_product_header">

    <span>TITLE</span>

    <span>CATEGORY</span>

    <span>PRICE</span>

    <span>STOCK</span>

    <span>ACTIONS</span>

  </div>


  {/* Products */}

  {products.map((product) => (

    <div
      className="seller_product_card"
      key={product.id}
    >

      {/* Title + Image */}

      <div className="product_title">

        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt={product.title}
          />
        )}

        {editingId === product.id ? (

          <input
            type="text"
            value={editName}
            onChange={(e) =>
              setEditName(e.target.value)
            }
          />

        ) : (

          <h3>{product.title}</h3>

        )}

      </div>


      {/* Category */}

      <div className="product_category">
        {product.category}
      </div>


      {/* Price */}

      <div className="product_price">

        {editingId === product.id ? (

          <input
            type="number"
            value={editPrice}
            onChange={(e) =>
              setEditPrice(e.target.value)
            }
          />

        ) : (

          <span>${product.price}</span>

        )}

      </div>


      {/* Stock */}

      <div className="product_stock">

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


      {/* Actions */}

      <div className="product_actions">

        {editingId === product.id ? (

          <button
            type="button"
            onClick={() =>
              saveEdit(product.id)
            }
          >
            Save
          </button>

        ) : (

          <button
            type="button"
            onClick={() =>
              startEdit(product)
            }
          >
            Edit
          </button>

        )}

        <button
          type="button"
          onClick={() =>
            deleteProduct(product.id)
          }
        >
          Delete
        </button>

      </div>

    </div>

  ))}

</div>

    </div>
  );
}

export default SellerProducts;