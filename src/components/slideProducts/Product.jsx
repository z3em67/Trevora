import React, { useContext } from 'react'
import { LuStar, LuHeart, LuShare2, LuCheck, LuShoppingCart } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

// كومبوننت النجوم: بيرسم 5 نجوم وبيملا منهم الجزء المناسب للتقييم (حتى الكسور زي 3.5)
function Stars({ value = 0 }) {
  return (
    <div className="stars" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        // نسبة تعبئة النجمة دي (من 0 لـ 1) حسب التقييم
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span className="star" key={i}>
            <LuStar />
            <LuStar className="fill" style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }} />
          </span>
        );
      })}
      <em>{Number(value).toFixed(1)}</em>
    </div>
  );
}

// كارت المنتج: صورة واسم وسعر وتقييم وزرار إضافة للسلة وقلب للمفضلة وزرار مشاركة
function Product({item}) {

  const navigate = useNavigate()

  const {cartItems , addToCart , addToFavorites , favorites , removeFromFavorites} = useContext(CartContext)

  // بنشوف المنتج ده موجود في السلة ولا لأ (عشان نقفل الزرار)
  const isInCart = cartItems.some(i => i.id === item.id);

  // بتضيف المنتج للسلة وتظهر إشعار فيه صورة المنتج وزرار يودّيك للسلة
  const handleAddToCart = () => {
    addToCart(item)

    toast.success(
      <div className='toast-wrapper'>
        <img src={item.images[0]} alt="" className='toast-img'/>

        <div className="toast-content">
          <strong>{item.title}</strong>
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
  // بنشوف المنتج ده في المفضلة ولا لأ
  const isInFav = favorites.some(i => i.id === item.id);

  // بتبدّل المنتج في المفضلة: لو موجود بتشيله ولو مش موجود بتضيفه، مع إشعار
  const handleAddToFav = () => {
    if(isInFav) {
      removeFromFavorites(item.id)
      toast.error(`${item.title} Removed from favorites`)
    }else{
    addToFavorites(item)
    toast.success(`${item.title} added To favorites`)
    }
   }

  // بتشارك لينك المنتج: لو المتصفح بيدعم المشاركة بتفتحها، غير كده بتنسخ اللينك
  const handleShare = async () => {
    const url = `${window.location.origin}/products/${item.id}`
    try {
      if (navigator.share) await navigator.share({ title: item.title, url })
      else { await navigator.clipboard.writeText(url); toast.success('Link copied') }
    } catch { /* share dismissed */ }
  }

  // نسبة الخصم متقرّبة لأقرب رقم صحيح
  const discount = Math.round(item.discountPercentage || 0)
  // السعر القديم قبل الخصم (بيتحسب من السعر الحالي ونسبة الخصم)
  const oldPrice = discount > 0 ? item.price / (1 - item.discountPercentage / 100) : null

  return (
    <article className={`product ${isInCart ? 'in-cart' : ''}`}>
        <div className="product_media">
          <Link to={`/products/${item.id}`} className="img_product" aria-label={item.title}>
              <img src={item.images[0]} alt={item.title} loading="lazy" />
          </Link>
          {discount > 0 && <span className="badge sale">-{discount}%</span>}
          <div className="icons">
              <button type="button" className={`btn-icon ${isInFav ? "active" : ""}`} onClick={handleAddToFav} aria-label={isInFav ? "Remove from favorites" : "Add to favorites"}><LuHeart /></button>
              <button type="button" className="btn-icon" onClick={handleShare} aria-label="Share"><LuShare2 /></button>
          </div>
        </div>

        <div className="product_body">
          {item.brand && <p className="brand">{item.brand}</p>}
          <Link to={`/products/${item.id}`} className="name_product">{item.title}</Link>
          <Stars value={item.rating} />
          <div className="price">
            <strong>${Number(item.price).toFixed(2)}</strong>
            {oldPrice && <s>${oldPrice.toFixed(2)}</s>}
          </div>
          <button type="button" className={`btn btn-sm btn-block ${isInCart ? 'btn-secondary' : 'btn-outline'}`} onClick={handleAddToCart} disabled={isInCart}>
            {isInCart ? <><LuCheck /> In cart</> : <><LuShoppingCart /> Add to cart</>}
          </button>
        </div>
    </article>
  )
}

export default Product
