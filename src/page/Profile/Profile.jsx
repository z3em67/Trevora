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
  LuStore,
  LuFileText,
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
  const [user, setUser] = useState(() =>
    readJSON("currentUser", null)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Seller information
  const [shopName, setShopName] = useState(user?.shopName || "");
  const [description, setDescription] = useState(
    user?.description || ""
  );

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

          <p>
            Log in to view and manage your profile.
          </p>

          <Link to="/login" className="pf_btn">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const role = user.role || "user";
  const isSeller = role === "seller";
const orders = readJSON("orders", []);

const userOrders = orders.filter(
  (order) => String(order.userId) === String(user.id)
);
  function validate() {
    const next = {};

    if (!name.trim()) {
      next.name = "Name is required";
    }

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (isSeller && !shopName.trim()) {
      next.shopName = "Shop name is required";
    }

    if (isSeller && !description.trim()) {
      next.description = "Shop description is required";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function startEditing() {
    setName(user.name || "");
    setEmail(user.email || "");

    if (isSeller) {
      setShopName(user.shopName || "");
      setDescription(user.description || "");
    }

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

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      ...(isSeller && {
        shopName: shopName.trim(),
        description: description.trim(),
      }),
    };

    // Save current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    // Update user inside users array
    const users = readJSON("users", []);

    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((u) =>
          u.id === user.id ? updatedUser : u
        )
      )
    );

    setUser(updatedUser);
    setIsEditing(false);

    toast.success("Profile updated");
  }

  function handleDeleteAccount() {
    const users = readJSON("users", []);

    localStorage.setItem(
      "users",
      JSON.stringify(
        users.filter((u) => u.id !== user.id)
      )
    );

    localStorage.removeItem("currentUser");

    toast.success("Account deleted");

    window.location.href = "/login";
  }

  return (
    <div className="pf_page">
      <div className="pf_card">

        <div className="pf_cover" />

        {/* Header */}
        <div className="pf_head">

          <div className="pf_avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>

          <div className="pf_head_text">

            <h1>{user.name}</h1><p className="pf_email">
              {user.email}
            </p>

            <span className="pf_role">
              {role}
            </span>

          </div>
        </div>

        <div className="pf_body">

          {!isEditing ? (
            <>
              <h2 className="pf_section_title">
                Account details
              </h2>

              <dl className="pf_list">

                {/* Full Name */}
                <div className="pf_row">

                  <span className="pf_row_icon">
                    <LuUser />
                  </span>

                  <div>
                    <dt>Full name</dt>
                    <dd>{user.name}</dd>
                  </div>

                </div>

                {/* Email */}
                <div className="pf_row">

                  <span className="pf_row_icon">
                    <LuMail />
                  </span>

                  <div>
                    <dt>Email address</dt>
                    <dd>{user.email}</dd>
                  </div>

                </div>

                {/* Role */}
                <div className="pf_row">

                  <span className="pf_row_icon">
                    <LuShield />
                  </span>

                  <div>
                    <dt>Account role</dt>
                    <dd className="pf_cap">
                      {role}
                    </dd>
                  </div>

                </div>

                {/* Seller Information */}
                {isSeller && (
                  <>
                    <div className="pf_row">

                      <span className="pf_row_icon">
                        <LuStore />
                      </span>

                      <div>
                        <dt>Shop name</dt>

                        <dd>
                          {user.shopName || "No shop name added"}
                        </dd>
                      </div>

                    </div>

                    <div className="pf_row">

                      <span className="pf_row_icon">
                        <LuFileText />
                      </span>

                      <div>
                        <dt>Shop description</dt>

                        <dd>
                          {user.description ||
                            "No shop description added"}
                        </dd>
                      </div>

                    </div>
                  </>
                )}

              </dl>

              <div className="pf_actions">

                <button
                  className="pf_btn"
                  onClick={startEditing}
                >
                  <LuPencil />
                  Edit profile
                </button>

                {isSeller && (
                  <Link
                    to="/seller/products"
                    className="pf_btn"
                  >
                    My Products
                  </Link>
                )}

              </div>
{/* Order History */}
<div className="pf_order_history">

  <h2 className="pf_section_title">
    Order History
  </h2>

  {userOrders.length === 0 ? (
    <div className="pf_no_orders">
      <p>No orders found.</p>
    </div>
  ) : (
    <div className="pf_orders">

      {userOrders
        .slice()
        .reverse()
        .map((order) => (
          <div className="pf_order" key={order.id}>

            <div className="pf_order_top">

              <div>
                <span className="pf_order_label">
                  Order ID
                </span>

                <strong>
                  #{order.id}
                </strong>
              </div>

              <span className="pf_order_status">
                {order.status || "Pending"}
              </span>

            </div>

            <div className="pf_order_info">

              <div>
                <span>Items</span>
                <strong>
                  {order.items?.length || 0}
                </strong>
              </div>

              <div>
                <span>Total</span>
                <strong>
                  ${Number(order.total || 0).toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {order.date || "N/A"}
                </strong>
              </div>

            </div>

          </div>
        ))}

    </div>
  )}

</div>
              <div className="pf_danger">

                <div>
                  <h3>Delete account</h3>

                  <p>
                    Permanently remove your account.
                    This can't be undone.
                  </p>
                </div>

                <button
                  className="pf_btn pf_btn_ghost_danger"
                  onClick={() => setShowDelete(true)}
                >
                  <LuTrash2 />
                  Delete
                </button>

              </div>
            </>
          ) : (

            /* EDIT PROFILE */
            <form
              className="pf_form"
              onSubmit={handleSave}
              noValidate
            >

              <h2 className="pf_section_title">
                Edit profile
              </h2>

              {/* Name */}
              <div className="pf_field">

                <label htmlFor="pf-name">
                  Full name
                </label><input
                  id="pf-name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className={
                    errors.name
                      ? "pf_invalid"
                      : ""
                  }
                  autoFocus
                />

                {errors.name && (
                  <small className="pf_error">
                    {errors.name}
                  </small>
                )}

              </div>

              {/* Email */}
              <div className="pf_field">

                <label htmlFor="pf-email">
                  Email address
                </label>

                <input
                  id="pf-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={
                    errors.email
                      ? "pf_invalid"
                      : ""
                  }
                />

                {errors.email && (
                  <small className="pf_error">
                    {errors.email}
                  </small>
                )}

              </div>

              {/* Seller Fields */}
              {isSeller && (
                <>
                  <div className="pf_field">

                    <label htmlFor="pf-shop-name">
                      Shop name
                    </label>

                    <input
                      id="pf-shop-name"
                      type="text"
                      value={shopName}
                      onChange={(e) =>
                        setShopName(e.target.value)
                      }
                      className={
                        errors.shopName
                          ? "pf_invalid"
                          : ""
                      }
                    />

                    {errors.shopName && (
                      <small className="pf_error">
                        {errors.shopName}
                      </small>
                    )}

                  </div>

                  <div className="pf_field">

                    <label htmlFor="pf-description">
                      Shop description
                    </label>

                    <textarea
                      id="pf-description"
                      rows="4"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      className={
                        errors.description
                          ? "pf_invalid"
                          : ""
                      }
                    />

                    {errors.description && (
                      <small className="pf_error">
                        {errors.description}
                      </small>
                    )}

                  </div>
                </>
              )}

              {/* Role */}
              <div className="pf_field">

                <label>
                  Account role
                </label>

                <div className="pf_readonly pf_cap">
                  {role}
                </div>

                <small className="pf_hint">
                  Role can't be changed here.
                </small>

              </div>

              <div className="pf_actions">

                <button
                  type="submit"
                  className="pf_btn"
                >
                  <LuCheck />
                  Save changes
                </button>

                <button
                  type="button"
                  className="pf_btn pf_btn_outline"
                  onClick={cancelEditing}
                >
                  <LuX />
                  Cancel
                </button>

              </div>

            </form>
          )}

        </div>
      </div>{/* Delete Modal */}
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
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <span className="pf_modal_icon">
              <LuTriangleAlert />
            </span>

            <h3 id="del-title">
              Delete your account?
            </h3>

            <p>
              This will permanently remove your
              account and can't be undone.
            </p>

            <div className="pf_modal_actions">

              <button
                className="pf_btn pf_btn_outline"
                onClick={() =>
                  setShowDelete(false)
                }
              >
                Cancel
              </button>

              <button
                className="pf_btn pf_btn_danger"
                onClick={handleDeleteAccount}
              >
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

