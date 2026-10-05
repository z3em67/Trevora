import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerSetup() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!storeName) {
      alert("Please enter your store name.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      storeName: storeName,
      storeDescription: storeDescription,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

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

        <p>Complete your store information</p>

        <form
          className="auth_form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) =>
              setStoreName(e.target.value)
            }
          />

          <textarea
            placeholder="Store Description"
            value={storeDescription}
            onChange={(e) =>
              setStoreDescription(e.target.value)
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