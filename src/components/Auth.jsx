import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const url = mode === "login" ? "/auth/login" : "/auth/signup";
      const { data } = await api.post(url, {
        email,
        password,
        name: "Founder",
      });

      // Persist auth
      localStorage.setItem("9jatax_token", data.token);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_email", data.user.email); // ✅ essential for onboarding

      if (data.user.company_id) {
        localStorage.setItem("company_id", data.user.company_id);
        navigate("/dashboard");
      } else {
        localStorage.removeItem("company_id");
        navigate("/settings/company"); // redirect new users to onboarding
      }
    } catch (err) {
      console.error(err);
      alert(
        "Authentication failed: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>{mode === "login" ? "Login" : "Sign up"}</h2>

      <form onSubmit={submit}>
        <div className="form-row">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="button" type="submit">
            {mode === "login" ? "Login" : "Create"}
          </button>

          <button
            type="button"
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
            className="button"
            style={{ background: "#445" }}
          >
            Switch
          </button>
        </div>
      </form>
    </div>
  );
}