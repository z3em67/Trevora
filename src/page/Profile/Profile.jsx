import { useState } from "react";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  function handleSave() {
    const updatedUser = {
      ...user,
      name: name,
      email: email,
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

        <h1>My Profile</h1>

        {!isEditing ? (
          <div className="profile_info">

            <div className="profile_item">
              <span> <strong>Name</strong></span>
              <p>{name}</p>
            </div>

            <div className="profile_item">
              <span><strong>Email</strong></span>
              <p>{email}</p>
            </div>

            <div className="profile_item">
              <span><strong>Role</strong></span>
              <p>{user?.role}</p>
            </div>

            <div className="profile_buttons">
              <button
                className="change_btn"
                onClick={() => setIsEditing(true)}
              >
                Change
              </button>

              <button
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
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="profile_item">
              <span>Role</span>
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

      </div>
    </div>
  );
}

export default Profile;