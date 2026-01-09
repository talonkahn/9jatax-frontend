import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const url = mode === "login" ? "/auth/login" : "/auth/signup";

      const payload =
        mode === "login"
          ? { email, password }
          : { email, password, name: "Founder" };

      const { data } = await api.post(url, payload);

      // Persist auth
      localStorage.setItem("9jatax_token", data.token);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_email", data.user.email);

      if (data.user.company_id) {
        localStorage.setItem("company_id", data.user.company_id);
        navigate("/dashboard");
      } else {
        localStorage.removeItem("company_id");
        navigate("/settings/company");
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
      alert(
        err.response?.data?.error ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>{mode === "login" ? "Login" : "Sign up"}</h2>

      <form onSubmit={submit}>
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="button" type="submit" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Login"
              : "Create"}
          </button>

          <button
            type="button"
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
            className="button"
            style={{ background: "#445" }}
            disabled={loading}
          >
            Switch
          </button>
        </div>
      </form>
    </div>
  );
}