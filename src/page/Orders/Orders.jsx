import React from "react";
import { Link } from "react-router-dom";
import {
  LuPackage,
  LuShoppingBag,
  LuCreditCard,
  LuClock,
  LuTruck,
  LuX,
} from "react-icons/lu";

import PageTransition from "../../components/PageTransition";
import "./Orders.css";

function Orders() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

const allOrders =
  JSON.parse(localStorage.getItem("orders")) || [];

const orders = currentUser
  ? allOrders.filter(
      (order) =>
        String(order.userId) === String(currentUser.id)
    )
  : [];
  // Get payment method name
  const getPaymentMethod = (method) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";

      case "card":
        return "Credit / Debit Card";

      case "paypal":
        return "PayPal";

      default:
        return "Not specified";
    }
  };

  // Cancel Order
  function handleCancelOrder(orderId) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    const allOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = allOrders.filter(
      (order) => order.id !== orderId
    );

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    // Refresh the page to show the updated orders
    window.location.reload();
  }

  return (
    <PageTransition>
      <div className="orders container">

        {/* Orders Header */}
        <div className="orders_header">
          <div>
            <h1>My Orders</h1>
            <p>View and track all your orders.</p>
          </div>

          <div className="orders_count">
            <LuPackage />
            <span>{orders.length} Orders</span>
          </div>
        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div className="empty_orders">

            <div className="empty_orders_icon">
              <LuShoppingBag />
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link to="/" className="btn">
              <LuShoppingBag />
              Start Shopping
            </Link>

          </div>
        ) : (

          /* Orders List */
          <div className="orders_list">

            {orders
              .slice()
              .reverse()
              .map((order) => (

                <div
                  className="order_card"
                  key={order.id}
                >

                  {/* Order Header */}
                  <div className="order_card_header">

                    <div>
                      <span>Order ID</span>
                      <h3>#{order.id}</h3>
                    </div>

                    <div className="order_date">
                      <LuClock />
                      <span>{order.date}</span>
                    </div>

                  </div>

                  {/* Order Details */}
                  <div className="order_card_body">

                    {/* Items */}
                    <div className="order_detail">

                      <div className="order_detail_icon">
                        <LuShoppingBag />
                      </div>

                      <div>
                        <span>Items</span>

                        <strong>
                          {order.items?.length || 0}
                        </strong>
                      </div>

                    </div>

                    {/* Payment */}
                    <div className="order_detail">

                      <div className="order_detail_icon">
                        <LuCreditCard />
                      </div>

                      <div>
                        <span>Payment</span>

                        <strong>
                          {getPaymentMethod(
                            order.payment?.method
                          )}
                        </strong>
                      </div>

                    </div>{/* Total */}
                    <div className="order_detail">

                      <div className="order_detail_icon">
                        <LuPackage />
                      </div>

                      <div>
                        <span>Total</span>

                        <strong>
                          $
                          {Number(
                            order.total || 0
                          ).toFixed(2)}
                        </strong>
                      </div>

                    </div>

                    {/* Status */}
                    <div className="order_detail">

                      <div className="order_detail_icon">
                        <LuTruck />
                      </div>

                      <div>
                        <span>Status</span>

                        <strong
                          className={`status ${
                            order.status?.toLowerCase() || ""
                          }`}
                        >
                          {order.status || "Pending"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* Order Footer */}
                  <div className="order_card_footer">

                    {/* Track Order */}
                    <Link
                      to={`/order-tracking/${order.id}`}
                      className="btn"
                    >
                      <LuTruck />
                      Track Order
                    </Link>

                    {/* Cancel Order */}
                    <button
                      className="btn cancel_order_btn"
                      onClick={() =>
                        handleCancelOrder(order.id)
                      }
                    >
                      <LuX />
                      Cancel Order
                    </button>

                  </div>

                </div>

              ))}

          </div>
        )}

      </div>
    </PageTransition>
  );
}

export default Orders;