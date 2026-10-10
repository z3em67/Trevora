import React, { useContext } from "react";
import { LuHeart, LuShare2, LuStar, LuShoppingCart, LuMinus, LuPlus, LuTruck, LuRotateCcw, LuShieldCheck } from "react-icons/lu";
import { CartContext } from "../../components/context/CartContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function ProductInfo({ product }) {

    const {cartItems , addToCart , increaseQuantity , decreaseQuantity , addToFavorites , favorites , removeFromFavorites} = useContext(CartContext)

    const cartItem = cartItems.find(i => i.id === product.id);
    const isInCart = Boolean(cartItem);

    const navigate = useNavigate()

    const handleAddToCart = () => {
        addToCart(product)

        toast.success(
          <div className='toast-wrapper'>
            <img src={product.images[0]} alt="" className='toast-img'/>

            <div className="toast-content">
              <strong>{product.title}</strong>
              added to Cart
              <div>
                <button className='btn' onClick={() => navigate('/cart')}> View Cart</button>
              </div>
            </div>
          </div>
          ,{duration : 3500}
        )
      }

  // favorites
  const isInFav = favorites.some(i => i.id === product.id);

  const handleAddToFav = () => {
    if(isInFav) {
      removeFromFavorites(product.id)
      toast.error(`${product.title} Removed from favorites`)
    }else{
    addToFavorites(product)
    toast.success(`${product.title} added To favorites`)
    }
   }

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.title, url })
      else { await navigator.clipboard.writeText(url); toast.success('Link copied') }
    } catch { /* share dismissed */ }
  }

  const discount = Math.round(product.discountPercentage || 0)
  const oldPrice = discount > 0 ? product.price / (1 - product.discountPercentage / 100) : null
  const status = product.availabilityStatus || ''
  const statusClass = /out/i.test(status) ? 'bad' : /low/i.test(status) ? 'warn' : 'ok'

  return (
    <div className="details_item">
      <Link to={`/category/${product.category}`} className="eyebrow">{product.category.replace(/-/g, ' ')}</Link>
      <h1 className="name">{product.title}</h1>

      <div className="rating_row">
        <div className="stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <span className="star" key={i}>
              <LuStar />
              <LuStar className="fill" style={{ clipPath: `inset(0 ${(1 - Math.max(0, Math.min(1, product.rating - i))) * 100}% 0 0)` }} />
            </span>
          ))}
        </div>
        <span>{Number(product.rating).toFixed(1)}</span>
        {product.reviews && <span>· {product.reviews.length} reviews</span>}
      </div>

      <div className="price_row">
        <p className="price">${Number(product.price).toFixed(2)}</p>
        {oldPrice && <s>${oldPrice.toFixed(2)}</s>}
        {discount > 0 && <span className="badge sale">-{discount}%</span>}
      </div>

      <p className="desc">{product.description}</p>

      <div className="meta">
        {status && <span className={`badge ${statusClass}`}>{status}</span>}
        {product.brand && <span>Brand: <strong>{product.brand}</strong></span>}
        {product.sku && <span>SKU: <strong>{product.sku}</strong></span>}
      </div>

      <p className="stock">
        {product.stock <= 20 ? `Hurry up! Only ${product.stock} products left in stock.` : `${product.stock} units in stock.`}
      </p>

      <div className="buy_row">
        {isInCart ? (
          <>
            <div className="quantity_control">
              <button onClick={() => decreaseQuantity(product.id)} aria-label="Decrease quantity"><LuMinus /></button>
              <span className="quantity">{cartItem.quantity}</span>
              <button onClick={() => increaseQuantity(product.id)} aria-label="Increase quantity"><LuPlus /></button>
            </div>
            <Link to="/cart" className="btn btn-lg">View cart</Link>
          </>
        ) : (
          <button onClick={handleAddToCart} className="btn btn-lg">
            <LuShoppingCart /> Add to cart
          </button>
        )}
        <button type="button" className={`btn-icon ${isInFav ? "active" : ""}`} onClick={handleAddToFav} aria-label={isInFav ? "Remove from favorites" : "Add to favorites"}><LuHeart /></button>
        <button type="button" className="btn-icon" onClick={handleShare} aria-label="Share"><LuShare2 /></button>
      </div>

      <ul className="assurances">
        <li><LuTruck /> {product.shippingInformation || "Free shipping on orders over $50"}</li>
        <li><LuRotateCcw /> {product.returnPolicy || "30-day return policy"}</li>
        <li><LuShieldCheck /> {product.warrantyInformation || "Secure checkout"}</li>
      </ul>
    </div>
  );
}

export default ProductInfo;
