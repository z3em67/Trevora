import React from "react";
import { Link } from "react-router-dom";
import {
  LuPackage,
  LuShoppingBag,
  LuCreditCard,
  LuClock,
  LuTruck,
} from "react-icons/lu";
import PageTransition from "../../components/PageTransition";
import "./orders.css";

function Orders() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const allOrders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const orders = currentUser
    ? allOrders.filter(
        (order) => order.userId === currentUser.id
      )
    : [];
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

  return (
    <PageTransition>
      <div className="orders container">
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

        {orders.length === 0 ? (
          <div className="empty_orders">
            <div className="empty_orders_icon">
              <LuShoppingBag />
            </div>

            <h2>No Orders Yet</h2>

            <p>You haven't placed any orders yet.</p>

            <Link to="/" className="btn">
              <LuShoppingBag />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders_list">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <div className="order_card" key={order.id}>
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

                  <div className="order_card_body">
                    <div className="order_detail">
                      <div className="order_detail_icon">
                        <LuShoppingBag />
                      </div>

                      <div>
                        <span>Items</span>

                        <strong>{order.items.length}</strong>
                      </div>
                    </div>

                    <div className="order_detail">
                      <div className="order_detail_icon">
                        <LuCreditCard />
                      </div>

                      <div>
                        <span>Payment</span>

                        <strong>
                          {getPaymentMethod(order.payment?.method)}
                        </strong>
                      </div>
                    </div>

                    <div className="order_detail">
                      <div className="order_detail_icon">
                        <LuPackage />
                      </div>

                      <div>
                        <span>Total</span>

                        <strong>${Number(order.total).toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="order_detail">
                      <div className="order_detail_icon">
                        <LuTruck />
                      </div>

                      <div>
                        <span>Status</span>

                        <strong
                          className={`status ${order.status?.toLowerCase()}`}
                        >
                          {order.status}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="order_card_footer">
                    <Link to={`/order-tracking/${order.id}`} className="btn">
                      <LuTruck />
                      Track Order
                    </Link>
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
