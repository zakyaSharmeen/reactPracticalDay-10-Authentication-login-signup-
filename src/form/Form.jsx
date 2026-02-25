import React, { useState, useEffect } from "react";

export default function Form() {
  // Track whether user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Toggle between Login and Signup
  const [isLogin, setIsLogin] = useState(true);

  // Store form data
  const [form, setForm] = useState({ email: "", password: "" });

  const [error, setError] = useState("");

  // Check login state on refresh
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (isLogin) {
      // LOGIN
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (
        storedUser &&
        storedUser.email === email &&
        storedUser.password === password
      ) {
        localStorage.setItem("auth", "true");
        setIsAuthenticated(true);
      } else {
        setError("Invalid email or password");
      }
    } else {
      // SIGNUP
      localStorage.setItem("user", JSON.stringify({ email, password }));
      setIsLogin(true);
      setError("Account created successfully. Please login.");
    }

    setForm({ email: "", password: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  // ---------------- DASHBOARD ----------------
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">You are logged in ✅</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ---------------- AUTH FORM ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
