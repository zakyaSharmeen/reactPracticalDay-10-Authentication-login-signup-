import React, { useState, useEffect } from "react";

export default function Form() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Tracks if the user is logged in or not

  const [isLogin, setIsLogin] = useState(true);
  // Toggles between Login and Signup form

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  // Stores form input values

  const [error, setError] = useState("");
  // Stores error messages

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    // Checks if login info exists in localStorage

    if (auth === "true") {
      setIsAuthenticated(true);
      // If user already logged in, show dashboard
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Updates form state dynamically based on input name
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevents page refresh on form submit

    setError("");
    // Clears previous error

    const { name, lastname, email, password } = form;
    // Destructuring form values

    if (!email || !password || (!isLogin && (!name || !lastname))) {
      setError("All fields are required");
      return;
      // Validation check
    }

    if (isLogin) {
      // LOGIN LOGIC

      const storedUser = JSON.parse(localStorage.getItem("user"));
      // Fetch saved user data from localStorage

      if (
        storedUser &&
        storedUser.email === email &&
        storedUser.password === password
      ) {
        localStorage.setItem("auth", "true");
        // Store login state

        setIsAuthenticated(true);
        // Show dashboard
      } else {
        setError("Invalid email or password");
        // If credentials don't match
      }
    } else {
      // SIGNUP LOGIC

      localStorage.setItem(
        "user",
        JSON.stringify({ name, lastname, email, password }),
      );
      // Saves user data to localStorage

      setIsLogin(true);
      // After signup switch to login page

      setError("Account created successfully. Please login.");
    }

    setForm({
      name: "",
      lastname: "",
      email: "",
      password: "",
    });
    // Clears form fields
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    // Removes login state

    setIsAuthenticated(false);
    // Redirects user back to login
  };

  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem("user"));
    // Get stored user info

    return (
      <div>
        <h1>
          Welcome {user?.name} {user?.lastname}
        </h1>
        {/* Shows logged in user's name */}

        <button onClick={handleLogout}>Logout</button>
        {/* Logout button */}
      </div>
    );
  }

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      {/* Shows form title based on mode */}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              value={form.name}
              onChange={handleChange}
            />
            {/* First name field only shown during signup */}

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
            />
            {/* Last name field only shown during signup */}
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {/* Email input */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {/* Password input */}

        {error && <p>{error}</p>}
        {/* Displays error message */}

        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        {/* Button changes based on form type */}
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
        {/* Toggle between login and signup */}
      </p>
    </div>
  );
}
