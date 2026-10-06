import React, { useContext } from 'react'
import { CartContext } from '../../components/context/CartContext'
import PageTransition from '../../components/PageTransition'
import Product from '../../components/slideProducts/Product'
import { Link } from 'react-router-dom'
import { LuHeart } from 'react-icons/lu'
import '../CategoryPage/categorypage.css'




// صفحة المفضلة: بتعرض المنتجات المحفوظة أو رسالة "مفيش مفضلة" لو فاضية
function Favorites() {
    const {favorites} = useContext(CartContext)

  return (
    <PageTransition >
        <div className="category_products FavoritesPage">
            <div className="container">
                <div className="top_slide">
                    <h2>Your Favorites</h2>
                </div>

                {favorites.length === 0 ? (
                    <div className="empty_state"><LuHeart /><h2>No favorites yet</h2><p>Tap the heart on any product to save it here.</p><Link to="/" className="btn">Browse products</Link></div>
                ) : (
                    <div className="products">
                        {favorites.map(item => (
                            <Product item={item} key={item.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </PageTransition>
  )
}

export default Favorites