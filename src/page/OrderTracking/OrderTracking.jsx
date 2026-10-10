import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuPackage,
  LuCircleCheck,
  LuSettings,
  LuTruck,
  LuHouse,
  LuArrowLeft,
} from "react-icons/lu";
import "./OrderTracking.css";

function OrderTracking() {
  const { orderId } = useParams();

  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  });

  const order = orders.find(
    (item) => String(item.id) === String(orderId)
  );

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

  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "Pending"
  );

  const currentIndex = statuses.findIndex(
    (status) =>
      status.name.toLowerCase() === currentStatus.toLowerCase()
  );

  // Automatically move to the next status every 4 seconds
  useEffect(() => {
    if (!order) return;

    if (currentIndex >= statuses.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      const nextStatus = statuses[currentIndex + 1].name;

      const updatedOrders = orders.map((item) =>
        String(item.id) === String(order.id)
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      );

      localStorage.setItem(
        "orders",
        JSON.stringify(updatedOrders)
      );

      setOrders(updatedOrders);
      setCurrentStatus(nextStatus);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStatus, currentIndex, order?.id]);

  if (!order) {
    return (
      <div className="order_tracking">
        <div className="tracking_not_found">
          <div className="tracking_not_found_icon">
            <LuPackage />
          </div>

          <h2>Order Not Found</h2>

          <p>
            We couldn't find this order.
          </p>

          <Link to="/orders" className="btn">
            <LuArrowLeft />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order_tracking">

      {/* Header */}
      <div className="tracking_header">

        <div>
          <h1>Order Tracking</h1>

          <p>
            Order #{order.id}
          </p>
        </div>

        <Link to="/orders" className="back_orders">
          <LuArrowLeft />
          Back to Orders
        </Link>

      </div>

      {/* Summary */}
      <div className="tracking_summary">

        <div className="tracking_summary_item">
          <span>Order ID</span>
          <strong>#{order.id}</strong>
        </div>

        <div className="tracking_summary_item">
          <span>Status</span>

          <strong
            className={`tracking_status ${currentStatus.toLowerCase()}`}
          >
            {currentStatus}
          </strong>
        </div>

        <div className="tracking_summary_item">
          <span>Total</span>

          <strong>
            ${Number(order.total || 0).toFixed(2)}
          </strong>
        </div>

      </div>

      {/* Tracking Card */}
      <div className="tracking_card">

        <h2>Order Status</h2>

        <div className="tracking_steps">

          {statuses.map((status, index) => {

            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                className={`tracking_step ${
                  isCompleted ? "completed" : ""
                } ${isCurrent ? "current" : ""}`}
                key={status.name}
              >

                <div className="step_icon">
                  {status.icon}
                </div><div className="step_content">

                  <strong>
                    {status.label}
                  </strong>

                  <span>
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                      ? "Current"
                      : "Waiting"}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

        {/* Delivered message */}
        {currentStatus === "Delivered" && (
          <div className="tracking_action">
            <p className="delivered_message">
              ✓ Your order has been delivered successfully.
            </p>
          </div>
        )}

      </div>

      {/* Order Items */}
      <div className="tracking_items">

        <div className="tracking_items_header">
          <LuPackage />

          <h2>Order Items</h2>
        </div>

        {order.items?.map((item, index) => (

          <div
            className="tracking_item"
            key={`${item.id}-${index}`}
          >

            <img
              src={item.thumbnail || item.image}
              alt={item.title}
            />

            <div className="tracking_item_info">

              <h3>
                {item.title}
              </h3>

              <p>
                Quantity: {item.quantity || 1}
              </p>

            </div>

            <strong>
              ${Number(item.price || 0).toFixed(2)}
            </strong>

          </div>

        ))}

      </div>

    </div>
  );
}

export default OrderTracking;