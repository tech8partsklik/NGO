import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";
import { setToken, setRefreshToken, setUser } from "../../utils/storage";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser: setAuthUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("Email & Password both required");
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, form);

      // Save tokens
      setToken(data.access);
      setRefreshToken(data.refresh);
      setUser(data.user);

      // Update Auth Context
      setAuthUser(data.user);

      // Redirect based on role
      if (data.user?.role?.name === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user?.role?.name === "member") {
        navigate("/member");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page section-spacing">
      <div className="container-xl">
        <div className="login-box">

          <h2>Welcome Back</h2>
          <p>Login into your account</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>
      </div>
    </section>
  );
}
