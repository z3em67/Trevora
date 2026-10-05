import { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [storeName, setStoreName] = useState(user?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    user?.storeDescription || ""
  );

  const allOrders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const currentUser =
  JSON.parse(localStorage.getItem("currentUser"));

const userOrders =
  currentUser?.role === "seller"
    ? []
    : currentUser
    ? allOrders.filter(
        (order) =>
          String(order.userId) === String(currentUser.id)
      )
    : [];
  function handleSave() {
    const updatedUser = {
      ...user,
      name,
      email,
      phone,

      ...(user?.role === "seller" && {
        storeName,
        storeDescription,
      }),
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.id === user.id ? updatedUser : u
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setIsEditing(false);

    alert("Profile updated");
  }

  function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) {
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.filter(
      (u) => u.id !== user.id
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    localStorage.removeItem("currentUser");

    alert("Account deleted");

    window.location.href = "/login";
  }

  return (
    <div className="profile_page">
      <div className="profile_card">

        <h1>
          {user&&user.role === "seller"
            ? "Seller Profile"
            : "My Profile"}
        </h1>

        {!isEditing ? (
          <div className="profile_info">

            <div className="profile_item">
              <span>
                <strong>Name</strong>
              </span>
              <p>{name}</p>
            </div>

            <div className="profile_item">
              <span>
                <strong>Email</strong>
              </span>
              <p>{email}</p>
            </div>

            <div className="profile_item">
              <span>
                <strong>Phone</strong>
              </span>
              <p>{phone}</p>
            </div>

            <div className="profile_item">
              <span>
                <strong>Role</strong>
              </span>
              <p>{user?.role}</p>
            </div>

            {user?.role === "seller" && (
              <>
                <div className="profile_item">
                  <span>
                    <strong>Store Name</strong>
                  </span>

                  <p>
                    {storeName || "Not added yet"}
                  </p>
                </div>

                <div className="profile_item">
                  <span>
                    <strong>Store Description</strong>
                  </span>

                  <p>
                    {storeDescription || "Not added yet"}
                  </p>
                </div>

                <div className="profile_item">
                  <Link to="/seller/products">
                    <button className="my_products_btn">
                      My Products
                    </button>
                  </Link>
                </div>
              </>
            )}

            <div className="profile_buttons">

              <button
                className="change_btn"
                onClick={() => setIsEditing(true)}
              >
                Change
              </button><button
                className="delete_btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>

            </div>

          </div>
        ) : (
          <div className="profile_form">

            <label>Name</label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <label>Email</label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>Phone</label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            {user?.role === "seller" && (
              <>
                <label>Store Name</label>

                <input
                  value={storeName}
                  onChange={(e) =>
                    setStoreName(e.target.value)
                  }
                />

                <label>Store Description</label>

                <textarea
                  value={storeDescription}
                  onChange={(e) =>
                    setStoreDescription(e.target.value)
                  }
                />
              </>
            )}

            <div className="profile_item">
              <span>
                <strong>Role</strong>
              </span>

              <p>{user?.role}</p>
            </div>

            <button
              className="save_btn"
              onClick={handleSave}
            >
              Save
            </button>

          </div>
        )}

        {/* Order History */}

        {user?.role !== "seller" && (
          <div className="order_history">

            <h2>Order History</h2>

            {userOrders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              userOrders.map((order) => (
                <div
                  className="order_card"
                  key={order.id}
                >
                  <h3>Order #{order.id}</h3>

                  <p>
                    <strong>Date:</strong> {order.date}
                  </p>

                  <p>
                    <strong>Total:</strong> ${order.total}
                  </p>

                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>

                  {order.items && (
                    <div>
                      <strong>Items:</strong>

                      {order.items.map((item, index) => (
                        <p key={index}>
                          {item.title} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;