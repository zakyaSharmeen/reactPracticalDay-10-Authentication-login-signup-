import React, { useState, useEffect } from "react";

// Signup → Data saved in localStorage →
// Login → Data compared →
// If matched → User authenticated →
// Auth state stored → Dashboard shown →
// Logout clears auth.

export default function Explain() {
  // ---------------- AUTH STATE ----------------
  // Stores whether user is logged in or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Toggle between Login and Signup mode
  const [isLogin, setIsLogin] = useState(true);

  // Stores form input values
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Stores error message
  const [error, setError] = useState("");

  // ---------------- CHECK AUTH ON PAGE LOAD ----------------
  // Runs once when component loads
  // Checks if user was already logged in (stored in localStorage)
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setIsAuthenticated(true); // restore login session
    }
  }, []);

  // ---------------- HANDLE INPUT CHANGE ----------------
  // Updates form state when user types
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Spread operator keeps old values and updates changed field
    setForm({ ...form, [name]: value });
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    setError(""); // reset previous errors

    const { email, password } = form;

    // Basic validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (isLogin) {
      // ---------------- LOGIN LOGIC ----------------

      // Get stored user from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // Check if user exists AND credentials match
      if (
        storedUser &&
        storedUser.email === email &&
        storedUser.password === password
      ) {
        localStorage.setItem("auth", "true"); // store login status
        setIsAuthenticated(true); // allow access
      } else {
        setError("Invalid email or password");
      }
    } else {
      // ---------------- SIGNUP LOGIC ----------------

      // Save new user into localStorage
      localStorage.setItem("user", JSON.stringify({ email, password }));

      // Switch to login mode after signup
      setIsLogin(true);

      setError("Account created successfully. Please login.");
    }

    // Clear form fields
    setForm({ email: "", password: "" });
  };

  // ---------------- LOGOUT FUNCTION ----------------
  const handleLogout = () => {
    localStorage.removeItem("auth"); // remove login session
    setIsAuthenticated(false); // redirect to login
  };

  // ---------------- DASHBOARD (PROTECTED UI) ----------------
  // If authenticated, show dashboard
  if (isAuthenticated) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You are logged in</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // ---------------- AUTH FORM ----------------
  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p>{error}</p>}

        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      {/* Toggle between login and signup */}
      <button
        onClick={() => {
          setIsLogin(!isLogin); // switch mode
          setError(""); // clear errors
        }}>
        {isLogin ? "Create Account" : "Already have account? Login"}
      </button>
    </div>
  );
}
