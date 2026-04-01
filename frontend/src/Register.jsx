import React, { useState } from 'react';
import './Register.css'; // Assuming you want to style the UI

const Register = ({ changePage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (!username || !password || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/register`, {
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

      if (data.message.includes("success")) {
        setMessage("User registered successfully");
        changePage('Login');
      }
    } catch (error) {
      setMessage("Registration failed: " + error.message);
    }
  };


  const handleGeneratePassword = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/generate-password`);
    const data = await response.json();

    setPassword(data.password);
    setConfirmPassword(data.password); // ✅ sync both
  } catch (error) {
    setMessage("Failed to generate password");
  }
};

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ fontSize: '12px', color: 'grey' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: '12px', color: 'grey' }}
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ fontSize: '12px', color: 'grey' }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>
        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <span
              className="link"
              onClick={() => changePage('Login')}
            >
              Login here
            </span>
          </p>
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="register-button"
          >
            Generate Password
          </button>
          <button type="submit" className="register-button">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;