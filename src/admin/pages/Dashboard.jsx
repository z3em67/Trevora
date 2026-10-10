import { useMemo } from "react";
import { Link } from "react-router-dom";
import { LuUsers, LuPackage, LuShoppingBag, LuDollarSign } from "react-icons/lu";
import { getUsers, getOrders, getCustomProducts, ORDER_STATUSES } from "../adminStore";
import { Badge, PageHead } from "../ui";

export default function Dashboard() {
  const { users, orders, custom } = useMemo(
    () => ({ users: getUsers(), orders: getOrders(), custom: getCustomProducts() }),
    []
  );
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + Number(o.total || 0), 0);
  const byStatus = ORDER_STATUSES.map((s) => ({
    s, n: orders.filter((o) => (o.status || "Pending") === s).length,
  }));
  const max = Math.max(1, ...byStatus.map((b) => b.n));

  return (
    <>
      <PageHead title="Dashboard" subtitle="Overview of your store" />
      <div className="adm_stats">
        <div className="adm_stat"><LuUsers /><div><span>Users</span><strong>{users.length}</strong></div></div>
        <div className="adm_stat"><LuShoppingBag /><div><span>Orders</span><strong>{orders.length}</strong></div></div>
        <div className="adm_stat"><LuDollarSign /><div><span>Revenue</span><strong>${revenue.toFixed(2)}</strong></div></div>
        <div className="adm_stat"><LuPackage /><div><span>Added products</span><strong>{custom.length}</strong></div></div>
      </div>

      <div className="adm_card">
        <h3>Orders by status</h3>
        {byStatus.map(({ s, n }) => (
          <div className="adm_bar" key={s}>
            <span>{s}</span><i style={{ width: `${(n / max) * 60}%` }} /><b>{n}</b>
          </div>
        ))}
      </div>

      <div className="adm_card">
        <h3>Recent orders</h3>
        {orders.length === 0 ? <div className="adm_empty">No orders yet.</div> : (
          <div className="adm_table_wrap">
            <table className="adm_table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(-5).reverse().map((o) => (
                  <tr key={o.id}>
                    <td><Link to="/admin/orders">#{o.id}</Link></td>
                    <td>{o.customer?.fullName || o.customer?.email || "-"}</td>
                    <td>${Number(o.total || 0).toFixed(2)}</td>
                    <td><Badge value={o.status || "Pending"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
