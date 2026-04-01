import React, { useState } from 'react';
import './Login.css'; // Assuming you want to style the UI

const Login = ({ changePage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("All fields are required");
      return;
    }

    const apiUrl = import.meta.env.VITE_APP_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined. Please check your environment variables.");
    }

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.token) {
        localStorage.setItem("token", data.token);   // ✅ STORE TOKEN
        // Handle successful login (e.g., store token)
        changePage("Dashboard");
      }
    } catch (error) {
      setMessage("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>
        <div className="form-footer">
          <p>
            New user?{' '}
            <span
              className="link"
              onClick={() => changePage('Register')}
            >
              Register here
            </span>
          </p>
          <button type="submit" className="login-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;