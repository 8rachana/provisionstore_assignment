import React, { useState } from "react";
import authService from "../services/authService";
import "./Login.css";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  };

  const hashPassword = async (plainTextPassword) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainTextPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashedPassword;
  };

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain one capital letter, one small letter, one number, and one special character"
      );
      return;
    }

    const hashedPassword = await hashPassword(password);

    try {
      setLoading(true);
      const accessToken = await authService.login(email, hashedPassword);
      authService.setAccessToken(accessToken);
      onLogin();
    } catch (error) {
      console.error("Login failed", error);
      if (error.response) {
        console.log("error.response", error.response);
        if (error.response.status === 401) {
          setEmailError("Invalid email or password");
        } else {
          setEmailError("An error occurred during login");
        }
      } else {
        setEmailError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
      if (emailError) {
        setPassword("");
        setEmail("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="lg-pg">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="lg-form">
        <input
          className="lg-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="error">{emailError}</p>}
        <div className="lg-psbt">
          <input
            className="lg-input2"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {passwordError && <p className="error">{passwordError}</p>}
        <button type="submit" disabled={loading} className="lg-btn">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
