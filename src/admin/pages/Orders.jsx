import { useState } from "react";
import toast from "react-hot-toast";
import { getOrders, updateOrder, deleteOrder, ORDER_STATUSES } from "../adminStore";
import { Badge, Modal, PageHead } from "../ui";

// صفحة إدارة الأوردرات والشحن: بحث وفلتر بالحالة وتغيير الحالة بسرعة وتفاصيل الأوردر وبيانات الشحن
export default function Orders() {
  const [orders, setOrders] = useState(getOrders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null); // {order, status, ship}

  // القايمة اللي بتتعرض: بعد الفلتر بالحالة والبحث (برقم الأوردر أو العميل أو رقم التتبع) ومترتبة من الأحدث
  const list = orders
    .filter((o) => status === "all" || (o.status || "Pending") === status)
    .filter((o) =>
      `${o.id} ${o.customer?.fullName || ""} ${o.customer?.email || ""} ${o.shippingInfo?.trackingNumber || ""}`
        .toLowerCase().includes(q.toLowerCase())
    )
    .slice().reverse();

  // بتفتح تفاصيل الأوردر وتجهّز بيانات الشحن الحالية للتعديل
  const view = (o) =>
    setOpen({
      order: o,
      status: o.status || "Pending",
      ship: { carrier: "", trackingNumber: "", estimatedDelivery: "", note: "", ...(o.shippingInfo || {}) },
    });
  // بتحدّث حقل واحد من بيانات الشحن
  const setShip = (k, v) => setOpen((s) => ({ ...s, ship: { ...s.ship, [k]: v } }));

  // بتحفظ الحالة وبيانات الشحن، وبتسجل وقت الشحن/التسليم أول مرة تتغير الحالة ليهم
  const save = () => {
    const patch = { status: open.status, shippingInfo: open.ship };
    if (open.status === "Shipped" && !open.order.shippedAt) patch.shippedAt = new Date().toLocaleString();
    if (open.status === "Delivered" && !open.order.deliveredAt) patch.deliveredAt = new Date().toLocaleString();
    setOrders(updateOrder(open.order.id, patch));
    toast.success("Order updated");
    setOpen(null);
  };
  // تغيير سريع لحالة الأوردر من القايمة المنسدلة في الجدول
  const quick = (o, s) => { setOrders(updateOrder(o.id, { status: s })); toast.success(`Order #${o.id} → ${s}`); };
  // بتمسح أوردر بعد تأكيد
  const remove = (o) => {
    if (!window.confirm(`Delete order #${o.id}?`)) return;
    setOrders(deleteOrder(o.id));
  };

  // الأوردر المفتوح حاليًا (لو في)
  const o = open?.order;
  // بيانات العميل بتاع الأوردر المفتوح
  const c = o?.customer || {};

  return (
    <>
      <PageHead title="Order & Shipping Management" subtitle={`${orders.length} orders`} />
      <div className="adm_tools">
        <input type="search" placeholder="Search order #, customer, tracking #" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="adm_table_wrap">
        <table className="adm_table">
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan="6" className="adm_empty">No orders found.</td></tr>}
            {list.map((x) => (
              <tr key={x.id}>
                <td>#{x.id}</td>
                <td>{x.date}</td>
                <td>{x.customer?.fullName || "-"}<br /><small>{x.customer?.email}</small></td>
                <td>${Number(x.total || 0).toFixed(2)}</td>
                <td>
                  <select value={x.status || "Pending"} onChange={(e) => quick(x, e.target.value)}>
                    {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <div className="adm_actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => view(x)}>Details / Ship</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(x)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title={`Order #${o.id}`} onClose={() => setOpen(null)}
          footer={<button type="button" className="btn btn-sm" onClick={save}>Save changes</button>}>
          <p><Badge value={open.status} /> &nbsp; {o.date}</p>

          <h4 style={{ margin: "14px 0 6px" }}>Customer & address</h4>
          <p>{c.fullName} · {c.email} · {c.phone}<br />
            {[c.address, c.apartment, c.city, c.postalCode, c.country].filter(Boolean).join(", ")}</p>

          <h4 style={{ margin: "14px 0 6px" }}>Items</h4>
          {o.items?.map((it) => (
            <p key={it.id}>{it.title} × {it.quantity} — ${(it.price * it.quantity).toFixed(2)}</p>
          ))}
          <p><b>Total: ${Number(o.total || 0).toFixed(2)}</b> · Payment: {o.payment?.method || "-"}</p>

          <h4 style={{ margin: "14px 0 8px" }}>Status & shipping</h4>
          <div className="adm_form">
            <label>Status
              <select value={open.status} onChange={(e) => setOpen({ ...open, status: e.target.value })}>
                {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Carrier<input type="text" placeholder="e.g. Aramex" value={open.ship.carrier} onChange={(e) => setShip("carrier", e.target.value)} /></label>
            <label>Tracking number<input type="text" value={open.ship.trackingNumber} onChange={(e) => setShip("trackingNumber", e.target.value)} /></label>
            <label>Estimated delivery<input type="text" placeholder="e.g. 12 Oct 2026" value={open.ship.estimatedDelivery} onChange={(e) => setShip("estimatedDelivery", e.target.value)} /></label>
            <label className="full">Note to customer<textarea rows="2" value={open.ship.note} onChange={(e) => setShip("note", e.target.value)} /></label>
          </div>
        </Modal>
      )}
    </>
  );
}
