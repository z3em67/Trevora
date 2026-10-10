import React, { useContext } from "react";
import { CartContext } from "../../components/context/CartContext";
import { LuTrash2, LuPlus, LuMinus, LuShoppingBag } from "react-icons/lu";
import { Link } from "react-router-dom";
import "./cart.css";
import PageTransition from "../../components/PageTransition";

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <PageTransition>
      <div className="checkout container">
        <h1 className="cart_title">
          Shopping cart{" "}
          {cartItems.length > 0 && (
            <span>
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          <div className="empty_state">
            <LuShoppingBag />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/" className="btn">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="cart_layout">
            <div className="items">
              {cartItems.map((item) => (
                <div className="item_cart" key={item.id}>
                  <div className="image_name">
                    <div className="img_item">
                      <img src={item.images[0]} alt="" />
                    </div>

                    <div className="content">
                      <h4>{item.title}</h4>
                      <p className="price_item">${item.price}</p>

                      <div className="quantity_control">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          <LuMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          <LuPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="delete_item"
                    aria-label="Remove item"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <aside className="ordersummary">
              <h2>Order Summary</h2>
              <div className="shop_table">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <div className="shop_table">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="shop_table total">
                <p>Total:</p>
                <span className="total_checkout">${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn-lg btn-block">
                Proceed to Checkout
              </Link>{" "}
            </aside>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default Cart;
