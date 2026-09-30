import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!user) {
      alert("Email or password is incorrect");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    alert("Login successful");

    navigate("/");
  }

 return (
  <div className="auth_page">
    <div className="auth_card">
      <h1>Login</h1>

      <form onSubmit={handleLogin} className="auth_form">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
<button type="submit" className="auth_btn">
  Login
</button>

{localStorage.getItem("currentUser") && (
  <button
    type="button"
    className="auth_btn logout_btn"
    onClick={() => {
      localStorage.removeItem("currentUser");
      alert("Logout successful");
    }}
  >
    Logout
  </button>
)}
      </form>
   
      <p className="auth_switch">
        Don't have an account?
        <Link to="/register"> Register</Link>
      </p>
 
    </div>
  </div>
);}
export default Login;