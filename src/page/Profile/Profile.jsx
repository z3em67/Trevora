import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Profile.css";
import {
  LuUser,
  LuMail,
  LuShield,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuX,
  LuTriangleAlert,
} from "react-icons/lu";

// بتقرا قيمة JSON من الـ localStorage وترجّع القيمة الافتراضية لو مفيش أو حصل خطأ
function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

// بتطلّع الحروف الأولى من الاسم (حرفين على الأكتر) عشان تتعرض في الأفاتار
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

// صفحة البروفايل: عرض بيانات الحساب وتعديل الاسم والإيميل ومسح الحساب
function Profile() {
  const [user, setUser] = useState(() => readJSON("currentUser", null));

  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [errors, setErrors] = useState({});

  // Not signed in
  if (!user) {
    return (
      <div className="pf_page">
        <div className="pf_empty">
          <span className="pf_empty_icon">
            <LuUser />
          </span>
          <h2>You're not signed in</h2>
          <p>Log in to view and manage your profile.</p>
          <Link to="/login" className="pf_btn">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  // بتتأكد إن الاسم والإيميل صح (والإيميل بشكل سليم) وبتحط الأخطاء وبترجّع true لو مفيش أخطاء
  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // بتفتح وضع التعديل وتملا الخانات بالبيانات الحالية
  function startEditing() {
    setName(user.name || "");
    setEmail(user.email || "");
    setErrors({});
    setIsEditing(true);
  }

  // بتلغي التعديل وتمسح الأخطاء
  function cancelEditing() {
    setErrors({});
    setIsEditing(false);
  }

  // بتحفظ التعديلات في currentUser وفي قايمة المستخدمين وتحدّث الشاشة
  function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;

    const updatedUser = { ...user, name: name.trim(), email: email.trim() };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = readJSON("users", []);
    localStorage.setItem(
      "users",
      JSON.stringify(users.map((u) => (u.id === user.id ? updatedUser : u)))
    );

    setUser(updatedUser);
    setIsEditing(false);
    toast.success("Profile updated");
  }

  // بتمسح الحساب من قايمة المستخدمين ومن currentUser وتودّي لصفحة الدخول
  function handleDeleteAccount() {
    const users = readJSON("users", []);
    localStorage.setItem(
      "users",
      JSON.stringify(users.filter((u) => u.id !== user.id))
    );
    localStorage.removeItem("currentUser");
    toast.success("Account deleted");
    window.location.href = "/login";
  }

  const role = user.role || "user";

  return (
    <div className="pf_page">
      <div className="pf_card">
        <div className="pf_cover" />

        <div className="pf_head">
          <div className="pf_avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>
          <div className="pf_head_text">
            <h1>{user.name}</h1>
            <p className="pf_email">{user.email}</p>
            <span className="pf_role">{role}</span>
          </div>
        </div>

        <div className="pf_body">
          {!isEditing ? (
            <>
              <h2 className="pf_section_title">Account details</h2>

              <dl className="pf_list">
                <div className="pf_row">
                  <span className="pf_row_icon">
                    <LuUser />
                  </span>
                  <div>
                    <dt>Full name</dt>
                    <dd>{user.name}</dd>
                  </div>
                </div>

                <div className="pf_row">
                  <span className="pf_row_icon">
                    <LuMail />
                  </span>
                  <div>
                    <dt>Email address</dt>
                    <dd>{user.email}</dd>
                  </div>
                </div>

                <div className="pf_row">
                  <span className="pf_row_icon">
                    <LuShield />
                  </span>
                  <div>
                    <dt>Account role</dt>
                    <dd className="pf_cap">{role}</dd>
                  </div>
                </div>
              </dl>

              <div className="pf_actions">
                <button className="pf_btn" onClick={startEditing}>
                  <LuPencil /> Edit profile
                </button>
              </div>

              <div className="pf_danger">
                <div>
                  <h3>Delete account</h3>
                  <p>Permanently remove your account. This can't be undone.</p>
                </div>
                <button
                  className="pf_btn pf_btn_ghost_danger"
                  onClick={() => setShowDelete(true)}
                >
                  <LuTrash2 /> Delete
                </button>
              </div>
            </>
          ) : (
            <form className="pf_form" onSubmit={handleSave} noValidate>
              <h2 className="pf_section_title">Edit profile</h2>

              <div className="pf_field">
                <label htmlFor="pf-name">Full name</label>
                <input
                  id="pf-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "pf_invalid" : ""}
                  autoFocus
                />
                {errors.name && <small className="pf_error">{errors.name}</small>}
              </div>

              <div className="pf_field">
                <label htmlFor="pf-email">Email address</label>
                <input
                  id="pf-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "pf_invalid" : ""}
                />
                {errors.email && <small className="pf_error">{errors.email}</small>}
              </div>

              <div className="pf_field">
                <label>Account role</label>
                <div className="pf_readonly pf_cap">{role}</div>
                <small className="pf_hint">Role can't be changed here.</small>
              </div>

              <div className="pf_actions">
                <button type="submit" className="pf_btn">
                  <LuCheck /> Save changes
                </button>
                <button
                  type="button"
                  className="pf_btn pf_btn_outline"
                  onClick={cancelEditing}
                >
                  <LuX /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showDelete && (
        <div
          className="pf_modal_backdrop"
          onClick={() => setShowDelete(false)}
          role="presentation"
        >
          <div
            className="pf_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="pf_modal_icon">
              <LuTriangleAlert />
            </span>
            <h3 id="del-title">Delete your account?</h3>
            <p>
              This will permanently remove your account and can't be undone.
            </p>
            <div className="pf_modal_actions">
              <button
                className="pf_btn pf_btn_outline"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button className="pf_btn pf_btn_danger" onClick={handleDeleteAccount}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;