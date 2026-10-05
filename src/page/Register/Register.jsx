import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();
    if (phone.length !== 11) {
  alert("Phone number must be 11 digits");
  return;
}

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      alert("Email already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      phone:phone,
      role: role,
    };

 users.push(newUser);

localStorage.setItem("users", JSON.stringify(users));

localStorage.setItem("currentUser", JSON.stringify(newUser));

alert("Account created successfully");

if (role === "seller") {
  navigate("/seller/setup");
} else {
  navigate("/");
}}
 return (
  <div className="auth_page">
    <div className="auth_card">

      <h1>Register</h1>

      <form className="auth_form" onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          maxLength="11"
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              setPhone(value);
            }
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="role_container">

          <label>
            <input
              type="radio"
              value="customer"
              checked={role === "customer"}
              onChange={(e) => setRole(e.target.value)}
            />
            Customer
          </label>

          <label>
            <input
              type="radio"
              value="seller"
              checked={role === "seller"}
              onChange={(e) => setRole(e.target.value)}
            />
            Seller
          </label>

        </div>

        <button className="auth_btn" type="submit">
          Register
        </button>

      </form>

      <p>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>

    </div>
  </div>
);
}

export default Register;