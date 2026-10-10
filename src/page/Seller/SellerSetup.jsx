import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerSetup() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!shopName.trim()) {
      alert("Please enter your shop name.");
      return;
    }

    const updatedUser = {
      ...currentUser,

      // Seller information
      shopName: shopName.trim(),
      description: description.trim(),
    };

    // Update current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    // Update user inside users array
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? updatedUser
        : user
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    alert("Seller information saved successfully!");

    navigate("/seller/profile");
  }

  return (
    <div className="auth_page">
      <div className="auth_card">

        <h1>Seller Information</h1>

        <p>Complete your shop information</p>

        <form
          className="auth_form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) =>
              setShopName(e.target.value)
            }
          />

          <textarea
            placeholder="Shop Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            className="auth_btn"
            type="submit"
          >
            Save Information
          </button>

        </form>

      </div>
    </div>
  );
}

export default SellerSetup;