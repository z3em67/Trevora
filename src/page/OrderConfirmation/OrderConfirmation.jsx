import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuCircleCheck,
  LuPackage,
  LuCreditCard,
  LuTruck,
  LuShoppingBag,
  LuClock,
} from "react-icons/lu";
import PageTransition from "../../components/PageTransition";
import "./OrderConfirmation.css";

// صفحة تأكيد الطلب: بتعرض بيانات الأوردر اللي لسه متعمل (رقم وإجمالي ودفع وحالة) أو رسالة "مش موجود"
function OrderConfirmation() {
  const { orderId } = useParams();

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // بندوّر على الأوردر برقمه من الرابط
  const order = orders.find((item) => item.id.toString() === orderId);

  // بتحوّل كود طريقة الدفع لاسم مقروء
  const getPaymentMethod = () => {
    if (!order?.payment?.method) {
      return "Not specified";
    }

    switch (order.payment.method) {
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
      <div className="confirmation container">
        {order ? (
          <>
            {/* Success Icon */}
            <div className="success_icon">
              <LuCircleCheck />
            </div>

            <h1>Order Placed Successfully!</h1>

            <p className="confirmation_message">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>

            {/* Order Information */}
            <div className="order_info">
              <div className="info_card">
                <div className="info_icon">
                  <LuPackage />
                </div>

                <div>
                  <span>Order ID</span>

                  <strong>#{order.id}</strong>
                </div>
              </div>

              <div className="info_card">
                <div className="info_icon">
                  <LuShoppingBag />
                </div>

                <div>
                  <span>Total</span>

                  <strong>${order.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="info_card">
                <div className="info_icon">
                  <LuCreditCard />
                </div>

                <div>
                  <span>Payment Method</span>

                  <strong>{getPaymentMethod()}</strong>
                </div>
              </div>

              <div className="info_card">
                <div className="info_icon">
                  <LuClock />
                </div>

                <div>
                  <span>Order Status</span>

                  <strong>{order.status}</strong>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="order_status">
              <div className="status_icon">
                <LuTruck />
              </div>

              <div>
                <h3>Order Status</h3>

                <p>
                  Your order is currently <strong>{order.status}</strong>.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="confirmation_buttons">
              <Link to={`/order-tracking/${order.id}`} className="btn">
                <LuTruck />
                Track Order
              </Link>

              <Link to="/" className="btn secondary_btn">
                <LuShoppingBag />
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="order_not_found">
            <div className="not_found_icon">
              <LuPackage />
            </div>

            <h1>Order Not Found</h1>

            <p>We couldn't find the order you're looking for.</p>

            <Link to="/" className="btn">
              <LuShoppingBag />
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default OrderConfirmation;
