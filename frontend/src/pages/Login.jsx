import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

export default function Login() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ EMAIL VALIDATION
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ PASSWORD VALIDATION
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  // 📧 STEP 1: CHECK USER
  const handleEmail = async () => {
    setError("");

    if (!email) {
      setError("Please enter email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await api.checkUser(email);

      if (res.exists) {
        setStep("login");
      } else {
        localStorage.setItem("temp_email", email);
        navigate("/onboarding");
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 STEP 2: LOGIN
  const handleLogin = async () => {
    setError("");

    if (!password) {
      setError("Enter password");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.login(email, password);

      if (res.user_id) {
        localStorage.setItem("user_id", String(res.user_id));
        navigate("/dashboard");
      } else {
        setError(res.error || "Invalid credentials");
      }

    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2>🌱 Gardening App</h2>
        <p className="subtext">Welcome! Enter your email to continue</p>

        {step === "email" && (
          <div className="form-group">
            <label>Email</label>
            <input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleEmail} disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </div>
        )}

        {step === "login" && (
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* ✅ CLEAN ERROR MESSAGE */}
        {error && (
          <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
            {error}
          </p>
        )}

      </div>
    </div>
  );
}