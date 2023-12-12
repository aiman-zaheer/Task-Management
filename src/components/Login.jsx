import React, { useState } from "react";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  let handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:4000`, { email, password, role: selectedRole })
      .then((res) => {
        if (res.data.message === "Invalid email or password") {
          alert("Invalid email or password");
        } else if (res.data.message === "ok") {
          const { name, role, _id } = res.data.resData;
          localStorage.setItem("role", role);
          localStorage.setItem("id", _id);
          localStorage.setItem("refreshToken", res.headers.refresh_token);
          localStorage.setItem("authorization", res.headers.authorization);
          navigate("/task");
        } else if (res.data.message === "internal error") {
          alert("internal error");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
    setEmail("");
    setName("");
    setPassword("");
    setSelectedRole("");
  };
  return (
    <div className="App">
      <div className="form-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit} action="post">
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
          />

          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
          />

          <div className="roles">
            <div className="user-role">
              <input
                type="radio"
                name="roles"
                id="user"
                required
                onChange={() => setSelectedRole("user")}
                checked={selectedRole === "user"}
              />
              <label htmlFor="user">User</label>
            </div>
            <div>
              <input
                type="radio"
                name="roles"
                id="admin"
                onChange={() => setSelectedRole("admin")}
                checked={selectedRole === "admin"}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>

          <button className="submit-btn" type="submit">
            Login
          </button>
          <button className="link" onClick={() => navigate("/register")}>
            Don't have an account? Register here.
          </button>
        </form>
      </div>
    </div>
  );
}
