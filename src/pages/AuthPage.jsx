import { useState } from "react";
import { login, register } from "../api";

const accent = "#D85A30";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(null);
    if (!form.email || !form.password) return setError("請填寫所有欄位");
    if (mode === "register" && !form.name) return setError("請填寫姓名");
    setLoading(true);
    try {
      const data = mode === "login"
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px", background: "#faf9f7" }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>🍱</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: -0.5 }}>CampusEats</div>
        <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>彰化師範大學 周邊美食</div>
      </div>

      {/* Tab */}
      <div style={{ display: "flex", background: "#f0ede8", borderRadius: 12, padding: 4, marginBottom: 24, width: "100%", maxWidth: 360 }}>
        {["login", "register"].map((m) => (
          <button key={m} onClick={() => { setMode(m); setError(null); }} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 9, background: mode === m ? "#fff" : "transparent", color: mode === m ? "#1a1a1a" : "#999", fontWeight: mode === m ? 700 : 400, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {m === "login" ? "登入" : "註冊"}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 20, padding: "24px", border: "0.5px solid #eae8e3" }}>

        {mode === "register" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>姓名</div>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="你的名字" style={inputStyle} />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Email</div>
          <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" type="email" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>密碼</div>
          <input value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="至少 6 個字" type="password" style={inputStyle} />
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "0.5px solid #ffcccc", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#cc0000", marginBottom: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#f0ede8" : accent, color: loading ? "#999" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
          {loading ? "處理中..." : mode === "login" ? "登入" : "註冊"}
        </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 13, color: "#999" }}>
        {mode === "login" ? "還沒有帳號？" : "已有帳號？"}
        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }} style={{ background: "none", border: "none", color: accent, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginLeft: 4 }}>
          {mode === "login" ? "立即註冊" : "去登入"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px",
  border: "0.5px solid #e0ede8", borderRadius: 10,
  fontSize: 14, color: "#333", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
  background: "#faf9f7",
};
