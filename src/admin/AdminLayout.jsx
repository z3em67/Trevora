import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard, LuUsers, LuPackage, LuLayoutGrid,
  LuTruck, LuImage, LuStore, LuLogOut,
} from "react-icons/lu";
import "./admin.css";

const links = [
  { to: "/admin", label: "Dashboard", icon: <LuLayoutDashboard />, end: true },
  { to: "/admin/users", label: "Users", icon: <LuUsers /> },
  { to: "/admin/products", label: "Products", icon: <LuPackage /> },
  { to: "/admin/categories", label: "Categories", icon: <LuLayoutGrid /> },
  { to: "/admin/orders", label: "Orders & Shipping", icon: <LuTruck /> },
  { to: "/admin/banners", label: "Homepage Banners", icon: <LuImage /> },
];

// اللاي أوت بتاع لوحة الأدمن: سايد بار فيه اللينكات + زرار رجوع للمتجر + زرار تسجيل خروج، والصفحة نفسها بتتعرض في الـ Outlet
export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="adm">
      <aside className="adm_side">
        <h2 className="adm_logo">Admin</h2>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.icon}<span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="adm_side_foot">
          <Link to="/"><LuStore /><span>View store</span></Link>
          {/* تسجيل الخروج من لوحة الأدمن: بنمسح المستخدم الحالي ونروّحه لصفحة اللوجين */}
          <button type="button" onClick={() => { localStorage.removeItem("currentUser"); navigate("/login"); }}>
            <LuLogOut /><span>Logout</span>
          </button>
        </div>
      </aside>
      <section className="adm_main"><Outlet /></section>
    </div>
  );
}
