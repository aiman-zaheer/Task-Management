import React, { useState } from "react";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();
  let handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:4000/signup", {
        email,
        password,
        name,
        role: selectedRole,
      })
      .then((res) => {
        if (res.data.message === "already exist") {
          alert("already exist");
        } else if (res.data.message === "ok") {
          navigate("/");
        } else if (res.data.message === "internal error") {
          alert("internal error");
        }
      })
      .catch((e) => {
        console.log(e);
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
        <h2>Registration</h2>
        <form className="register-form" onSubmit={handleSubmit} action="post">
          <label htmlFor="name">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="text"
            placeholder="Enter Your Name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            required
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
            Register
          </button>
          <button className="link" onClick={() => navigate("/")}>
            Already have an account? Login here.
          </button>
        </form>
      </div>
    </div>
  );
}
