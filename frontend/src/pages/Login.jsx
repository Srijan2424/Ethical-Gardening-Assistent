import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";   // ✅ FIXED PATH

export default function Login() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmail = async () => {
    const res = await api.checkUser(email);

    if (res.exists) {
      setStep("login");
    } else {
      localStorage.setItem("temp_email", email);
      navigate("/onboarding");
    }
  };

  const handleLogin = async () => {
    const res = await api.login(email, password);

    if (res.user_id) {
      localStorage.setItem("user_id", res.user_id);
      navigate("/dashboard");
    } else {
      alert(res.error || "Invalid credentials");
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
            <button onClick={handleEmail}>Continue</button>
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
            <button onClick={handleLogin}>Login</button>
          </div>
        )}

      </div>
    </div>
  );
}