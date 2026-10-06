
import React, { useState } from "react";

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

import "./OrderTracking.css";

// صفحة تتبع الأوردر: بتعرض مراحل الأوردر (تم الطلب → تأكيد → تجهيز → شحن → توصيل) وبيانات الشحن وعناصر الأوردر
function OrderTracking() {
  const { orderId } = useParams();

  // Get all orders from localStorage
  // بنقرا كل الأوردرات من الـ localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // Find current order
  // بندوّر على الأوردر برقمه من الرابط
  const order = orders.find((item) => item.id.toString() === orderId);

  // مراحل الأوردر بالترتيب (الاسم والعنوان والأيقونة لكل مرحلة)
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

  // الحالة الحالية للأوردر
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "Pending",
  );

  // ترتيب الحالة الحالية في قايمة المراحل (عشان نعرف أنهي مراحل خلصت)
  const currentIndex = statuses.findIndex(
    (status) => status.name.toLowerCase() === currentStatus.toLowerCase(),
  );

  // بتنقل الأوردر للمرحلة اللي بعدها وتحفظها في الـ localStorage (بتظهر للأدمن بس)
  const handleNextStatus = () => {

    if (!order) return;

    if (currentIndex >= statuses.length - 1) {
      return;
    }

    const nextStatus = statuses[currentIndex + 1].name;

    setCurrentStatus(nextStatus);

    const updatedOrders = orders.map((item) =>
      item.id === order.id
        ? {
            ...item,
            status: nextStatus,
          }
        : item,
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

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

              

                <div className="tracking_action">
                  {JSON.parse(localStorage.getItem("currentUser") || "null")?.role !== "admin" ? null : currentIndex < statuses.length - 1 ? (
                    <button
                      type="button"
                      className="btn"
                      onClick={handleNextStatus}
                    >
                      Move to Next Status
                    </button>
                  ) : (
                    <p className="delivered_message">
                      ✓ Order Delivered Successfully
                    </p>
                  )}
                </div>
              </div>
            )}


            {order.shippingInfo &&
              (order.shippingInfo.carrier ||
                order.shippingInfo.trackingNumber ||
                order.shippingInfo.estimatedDelivery ||
                order.shippingInfo.note) && (
                <div className="tracking_card">
                  <h2>Shipping Details</h2>
                  {order.shippingInfo.carrier && (
                    <p>Carrier: <strong>{order.shippingInfo.carrier}</strong></p>
                  )}
                  {order.shippingInfo.trackingNumber && (
                    <p>Tracking number: <strong>{order.shippingInfo.trackingNumber}</strong></p>
                  )}
                  {order.shippingInfo.estimatedDelivery && (
                    <p>Estimated delivery: <strong>{order.shippingInfo.estimatedDelivery}</strong></p>
                  )}
                  {order.shippingInfo.note && <p>{order.shippingInfo.note}</p>}
                </div>
              )}

            <div className="tracking_items">
              <div className="tracking_items_header">
                <LuShoppingBag />

                <h2>Order Items</h2>
              </div>

              {order.items.map((item) => (
                <div className="tracking_item" key={item.id}>
                  {/* Product Image */}

                  <img src={item.images[0]} alt={item.title} />

                  {/* Product Information */}

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
