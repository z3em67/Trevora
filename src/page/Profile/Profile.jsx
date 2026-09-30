import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

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
      <div className="profile_page">
        <div className="profile_empty">
          <span className="profile_empty_icon">
            <LuUser />
          </span>
          <h2>You're not signed in</h2>
          <p>Log in to view and manage your profile.</p>
          <Link to="/login" className="btn">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function startEditing() {
    setName(user.name || "");
    setEmail(user.email || "");
    setErrors({});
    setIsEditing(true);
  }

  function cancelEditing() {
    setErrors({});
    setIsEditing(false);
  }

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
    <div className="profile_page">
      <div className="profile_card">
        <div className="profile_cover" />

        <div className="profile_head">
          <div className="profile_avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>
          <div className="profile_head_text">
            <h1>{user.name}</h1>
            <span className="profile_role">{role}</span>
          </div>
        </div>

        <div className="profile_body">
          {!isEditing ? (
            <>
              <h2 className="profile_section_title">Account details</h2>

              <dl className="profile_list">
                <div className="profile_row">
                  <span className="profile_row_icon">
                    <LuUser />
                  </span>
                  <div>
                    <dt>Full name</dt>
                    <dd>{user.name}</dd>
                  </div>
                </div>

                <div className="profile_row">
                  <span className="profile_row_icon">
                    <LuMail />
                  </span>
                  <div>
                    <dt>Email address</dt>
                    <dd>{user.email}</dd>
                  </div>
                </div>

                <div className="profile_row">
                  <span className="profile_row_icon">
                    <LuShield />
                  </span>
                  <div>
                    <dt>Account role</dt>
                    <dd className="cap">{role}</dd>
                  </div>
                </div>
              </dl>

              <div className="profile_actions">
                <button className="btn" onClick={startEditing}>
                  <LuPencil /> Edit profile
                </button>
              </div>

              <div className="profile_danger">
                <div>
                  <h3>Delete account</h3>
                  <p>Permanently remove your account. This can't be undone.</p>
                </div>
                <button
                  className="btn btn-outline profile_delete_btn"
                  onClick={() => setShowDelete(true)}
                >
                  <LuTrash2 /> Delete
                </button>
              </div>
            </>
          ) : (
            <form className="profile_form" onSubmit={handleSave} noValidate>
              <h2 className="profile_section_title">Edit profile</h2>

              <div className="field">
                <label htmlFor="pf-name">Full name</label>
                <input
                  id="pf-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "invalid" : ""}
                  autoFocus
                />
                {errors.name && <small className="field_error">{errors.name}</small>}
              </div>

              <div className="field">
                <label htmlFor="pf-email">Email address</label>
                <input
                  id="pf-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "invalid" : ""}
                />
                {errors.email && <small className="field_error">{errors.email}</small>}
              </div>

              <div className="field">
                <label>Account role</label>
                <div className="field_readonly cap">{role}</div>
                <small className="field_hint">Role can't be changed here.</small>
              </div>

              <div className="profile_actions">
                <button type="submit" className="btn">
                  <LuCheck /> Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
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
          className="modal_backdrop"
          onClick={() => setShowDelete(false)}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="modal_icon">
              <LuTriangleAlert />
            </span>
            <h3 id="del-title">Delete your account?</h3>
            <p>
              This will permanently remove your account and can't be undone.
            </p>
            <div className="modal_actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
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
