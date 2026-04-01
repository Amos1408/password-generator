import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = ({ changePage }) => {
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔒 Handle invalid token
      if (response.status === 401) {
        localStorage.removeItem("token");
        changePage("Login");
        return;
      }

      const data = await response.json();
      setMessage(data.message);

    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      changePage("Login");   // 🔒 redirect if no token
      return;
    }

    fetchData();
  }, []);

  let username = "";

if (token) {
  try {
    const decoded = jwtDecode(token);
    username = decoded.username;
  } catch (err) {
    console.error("Invalid token");
  }
}
return (
  <div style={styles.container}>
    
    {/* Title */}
    <h1 style={styles.title}>
      Welcome to Password & Checker System
    </h1>

    {/* Card */}
    <div style={styles.card}>
      <h2 style={styles.heading}>Dashboard</h2>

      <p style={styles.text}>Hello, <strong>{username}</strong>!</p>
      <p style={styles.text}>{message}</p>

      {/* Logout button */}
      <button
        style={styles.button}
        onClick={() => {
          localStorage.removeItem("token");
          changePage("Login");
        }}
      >
        Logout
      </button>
    </div>
  </div>
);
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#fff",
    marginBottom: "30px",
    textAlign: "center",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "300px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "15px",
  },
  text: {
    margin: "10px 0",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#667eea",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Dashboard;