import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuPackage,
  LuCircleCheck,
  LuSettings,
  LuTruck,
  LuHouse,
  LuShoppingBag,
  LuArrowLeft,
} from "react-icons/lu";
import PageTransition from "../../components/PageTransition";
import "./orderTracking.css";

function OrderTracking() {
  const { orderId } = useParams();

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = orders.find((item) => item.id.toString() === orderId);

  const statuses = [
    {
      name: "Pending",
      label: "Order Placed",
      icon: <LuPackage />,
    },
    {
      name: "Confirmed",
      label: "Order Confirmed",
      icon: <LuCircleCheck />,
    },
    {
      name: "Processing",
      label: "Processing",
      icon: <LuSettings />,
    },
    {
      name: "Shipped",
      label: "Shipped",
      icon: <LuTruck />,
    },
    {
      name: "Delivered",
      label: "Delivered",
      icon: <LuHouse />,
    },
  ];

  const currentStatus = order?.status || "Pending";

  const currentIndex = statuses.findIndex(
    (status) => status.name.toLowerCase() === currentStatus.toLowerCase(),
  );

  return (
    <PageTransition>
      <div className="order_tracking container">
        {!order ? (
          <div className="tracking_not_found">
            <div className="tracking_not_found_icon">
              <LuPackage />
            </div>

            <h1>Order Not Found</h1>

            <p>We couldn't find this order.</p>

            <Link to="/orders" className="btn">
              <LuArrowLeft />
              Back to Orders
            </Link>
          </div>
        ) : (
          <>
            <div className="tracking_header">
              <div>
                <h1>Track Your Order</h1>

                <p>Order #{order.id}</p>
              </div>

              <Link to="/orders" className="back_orders">
                <LuArrowLeft />
                My Orders
              </Link>
            </div>

            <div className="tracking_summary">
              <div className="tracking_summary_item">
                <span>Order Date</span>
                <strong>{order.date}</strong>
              </div>

              <div className="tracking_summary_item">
                <span>Total</span>
                <strong>${Number(order.total).toFixed(2)}</strong>
              </div>

              <div className="tracking_summary_item">
                <span>Status</span>
                <strong
                  className={`tracking_status ${currentStatus.toLowerCase()}`}
                >
                  {currentStatus}
                </strong>
              </div>
            </div>

            {currentStatus.toLowerCase() === "cancelled" ? (
              <div className="cancelled_order">
                <div className="cancelled_icon">
                  <LuPackage />
                </div>

                <div>
                  <h2>Order Cancelled</h2>

                  <p>
                    This order has been cancelled and will not be delivered.
                  </p>
                </div>
              </div>
            ) : (
              <div className="tracking_card">
                <h2>Order Status</h2>

                <div className="tracking_steps">
                  {statuses.map((status, index) => {
                    const isCompleted = index <= currentIndex;

                    const isCurrent = index === currentIndex;

                    return (
                      <div
                        className={`tracking_step ${
                          isCompleted ? "completed" : ""
                        } ${isCurrent ? "current" : ""}`}
                        key={status.name}
                      >
                        <div className="step_icon">{status.icon}</div>

                        <div className="step_content">
                          <strong>{status.label}</strong>

                          <span>
                            {isCurrent
                              ? "Current Status"
                              : isCompleted
                                ? "Completed"
                                : "Waiting"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="tracking_items">
              <div className="tracking_items_header">
                <LuShoppingBag />
                <h2>Order Items</h2>
              </div>

              {order.items.map((item) => (
                <div className="tracking_item" key={item.id}>
                  <img src={item.images[0]} alt={item.title} />
                  <div className="tracking_item_info">
                    <h3>{item.title}</h3>

                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}

export default OrderTracking;
