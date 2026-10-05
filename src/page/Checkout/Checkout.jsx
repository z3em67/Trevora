import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/context/CartContext";
import PageTransition from "../../components/PageTransition";
import "./checkout.css";

function Checkout() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const currentUser = JSON.parse(
  localStorage.getItem("currentUser")
);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    apartment: "",
    postalCode: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
  });

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
const currentUser = JSON.parse(
  localStorage.getItem("currentUser")
);

if (!currentUser) {
  alert("Please login or create an account before placing an order.");
  window.location.href = "/login";
  return;
}
    // Check cart
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Check customer information
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.city ||
      !formData.address ||
      !formData.postalCode
    ) {
      alert("Please fill in all required billing and shipping fields.");
      return;
    }

    // Check Credit / Debit Card
    if (paymentMethod === "card") {
      if (
        !paymentData.cardName ||
        !paymentData.cardNumber ||
        !paymentData.expiryDate ||
        !paymentData.cvv
      ) {
        alert("Please complete your card information.");
        return;
      }

      if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Card number must contain 16 digits.");
        return;
      }

      if (paymentData.cvv.length !== 3) {
        alert("CVV must contain 3 digits.");
        return;
      }
    }

    // Check PayPal
    if (paymentMethod === "paypal") {
      if (!paymentData.paypalEmail) {
        alert("Please enter your PayPal email.");
        return;
      }
    }

    // Payment information saved safely
    const paymentInfo = {
      method: paymentMethod,
    };

    if (paymentMethod === "card") {
      paymentInfo.cardName = paymentData.cardName;

      paymentInfo.last4 = paymentData.cardNumber.replace(/\s/g, "").slice(-4);
    }

    if (paymentMethod === "paypal") {
      paymentInfo.paypalEmail = paymentData.paypalEmail;
    }

    // Create order
    const order = {
      id: Date.now(),
      userId: currentUser?.id,
     customer: {
  ...formData,
  email: currentUser.email,
},
      items: cartItems,
      subtotal: total,
      shipping: 0,
      total: total,
      payment: paymentInfo,
      date: new Date().toLocaleString(),
      status: "Pending",
    };

    console.log("Order:", order);

    // Get previous orders
  const existingOrders =
  JSON.parse(localStorage.getItem("orders")) || [];

    // Add new order
    existingOrders.push(order);

    // Save all orders
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Remove products from cart
    cartItems.forEach((item) => {
      removeFromCart(item.id);
    });

    // Go to confirmation
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <PageTransition>
      <div className="checkout container">
        <h1>Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout_layout">
            {/* LEFT SIDE */}
            <div className="checkout_form">
              <h2>Billing Details</h2>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />

              <h2>Shipping Details</h2>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
              />

              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, etc. (optional)"
                value={formData.apartment}
                onChange={handleChange}
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            {/* RIGHT SIDE */}
            <aside className="ordersummary">
              <h2>Order Summary</h2>

              {cartItems.map((item) => (
                <div className="shop_table" key={item.id}>
                  <p>
                    {item.title} × {item.quantity}
                  </p>

                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

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

              {/* PAYMENT */}
              <div className="payment_methods">
                <h2>Payment Method</h2>

                {/* CASH */}
                <label className="payment_option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={handlePaymentMethodChange}
                  />

                  <span>Cash on Delivery</span>
                </label>

                {/* CARD */}
                <label className="payment_option">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={handlePaymentMethodChange}
                  />

                  <span>Credit / Debit Card</span>
                </label>

                {/* PAYPAL */}
                <label className="payment_option">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={handlePaymentMethodChange}
                  />

                  <span>PayPal</span>
                </label>

                {/* CARD FORM */}
                {paymentMethod === "card" && (
                  <div className="card_form">
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Card Holder Name"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                    />

                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      maxLength="19"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                    />

                    <div className="card_row">
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange}
                      />

                      <input
                        type="password"
                        name="cvv"
                        placeholder="CVV"
                        maxLength="3"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>
                )}

                {/* PAYPAL FORM */}
                {paymentMethod === "paypal" && (
                  <div className="paypal_form">
                    <input
                      type="email"
                      name="paypalEmail"
                      placeholder="PayPal Email"
                      value={paymentData.paypalEmail}
                      onChange={handlePaymentChange}
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-lg btn-block">
                Place Order
              </button>
            </aside>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

export default Checkout;
