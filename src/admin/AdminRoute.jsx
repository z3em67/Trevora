import { Link } from "react-router-dom";
import { LuShieldAlert } from "react-icons/lu";
import { getCurrentUser } from "./adminStore";

// Only lets admins in. NOTE: front-end only guard (data lives in localStorage).
// حارس الصفحات: لو المستخدم أدمن بيعرض الصفحة، غير كده بيعرض رسالة "للأدمن بس" مع لينك لصفحة الدخول
export default function AdminRoute({ children }) {
  const user = getCurrentUser();
  if (user?.role === "admin") return children;
  return (
    <div className="container">
      <div className="empty_state">
        <LuShieldAlert />
        <h2>Admins only</h2>
        <p>{user ? "Your account doesn't have admin access." : "Please sign in with an admin account."}</p>
        <Link to="/login" className="btn">Go to login</Link>
      </div>
    </div>
  );
}
