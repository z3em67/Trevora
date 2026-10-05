import { useState } from "react";
import toast from "react-hot-toast";
import { getUsers, updateUser, deleteUser, getCurrentUser } from "../adminStore";
import { Badge, PageHead } from "../ui";

export default function Users() {
  const [users, setUsers] = useState(getUsers);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const me = getCurrentUser();

  const list = users.filter(
    (u) =>
      (role === "all" || u.role === role) &&
      `${u.name} ${u.email} ${u.phone || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  const change = (u, patch, msg) => { setUsers(updateUser(u.id, patch)); toast.success(msg); };
  const remove = (u) => {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    setUsers(deleteUser(u.id));
    toast.success("User deleted");
  };

  return (
    <>
      <PageHead title="User Management" subtitle={`${users.length} users`} />
      <div className="adm_tools">
        <input type="search" placeholder="Search name, email, phone" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      <div className="adm_table_wrap">
        <table className="adm_table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan="6" className="adm_empty">No users found.</td></tr>}
            {list.map((u) => {
              const self = me?.id === u.id;
              return (
                <tr key={u.id}>
                  <td>{u.name}{u.storeName && <><br /><small>{u.storeName}</small></>}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>
                    <select value={u.role} disabled={self} onChange={(e) => change(u, { role: e.target.value }, "Role updated")}>
                      <option value="customer">customer</option>
                      <option value="seller">seller</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td><Badge value={u.banned ? "Banned" : "Active"} /></td>
                  <td>
                    <div className="adm_actions">
                      <button type="button" className="btn btn-outline btn-sm" disabled={self}
                        onClick={() => change(u, { banned: !u.banned }, u.banned ? "User unbanned" : "User banned")}>
                        {u.banned ? "Unban" : "Ban"}
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" disabled={self} onClick={() => remove(u)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
