import { useState } from "react";

const accent = "#D85A30";

export default function SettingsPage({ user, onBack, onUpdate }) {
  const [tab, setTab] = useState("name");
  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const saveName = async () => {
    if (!name.trim()) return setError("名稱不能為空");
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onUpdate(data.user);
      setMessage("✅ 名稱已更新！");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return setError("請填寫所有欄位");
    if (newPassword !== confirmPassword) return setError("新密碼與確認密碼不一致");
    if (newPassword.length < 6) return setError("新密碼至少 6 個字");
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await fetch("http://localhost:3000/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("✅ 密碼已更新！");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7" }}>
      <div style={{ background: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid #eae8e3", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a" }}>偏好設定</div>
      </div>

      {/* Tab */}
      <div style={{ display: "flex", background: "#f0ede8", borderRadius: 12, padding: 3, margin: "16px", }}>
        {["name", "password"].map((t) => (
          <button key={t} onClick={() => { setTab(t); setError(null); setMessage(null); }} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 9, background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1a1a1a" : "#999", fontWeight: tab === t ? 700 : 400, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {t === "name" ? "修改名稱" : "修改密碼"}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>
        {tab === "name" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "0.5px solid #eae8e3" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>顯示名稱</div>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 6, marginBottom: 16 }}>這是其他用戶看到的名稱</div>
            {error && <ErrorBox text={error} />}
            {message && <SuccessBox text={message} />}
            <button onClick={saveName} disabled={loading} style={btnStyle(loading)}>
              {loading ? "儲存中..." : "儲存名稱"}
            </button>
          </div>
        )}

        {tab === "password" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "0.5px solid #eae8e3" }}>
            <Field label="舊密碼">
              <input value={oldPassword} onChange={e => setOldPassword(e.target.value)} type="password" placeholder="輸入目前的密碼" style={inputStyle} />
            </Field>
            <Field label="新密碼">
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="至少 6 個字" style={inputStyle} />
            </Field>
            <Field label="確認新密碼">
              <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="再輸入一次新密碼" style={inputStyle} />
            </Field>
            {error && <ErrorBox text={error} />}
            {message && <SuccessBox text={message} />}
            <button onClick={savePassword} disabled={loading} style={btnStyle(loading)}>
              {loading ? "儲存中..." : "更新密碼"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function ErrorBox({ text }) {
  return <div style={{ background: "#fff5f5", border: "0.5px solid #ffcccc", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#cc0000", marginBottom: 14 }}>⚠️ {text}</div>;
}

function SuccessBox({ text }) {
  return <div style={{ background: "#f0fff4", border: "0.5px solid #b2f5cb", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#1a8c5b", marginBottom: 14 }}>{text}</div>;
}

const inputStyle = { width: "100%", padding: "11px 14px", border: "0.5px solid #e0ede8", borderRadius: 10, fontSize: 14, color: "#333", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#faf9f7" };
const btnStyle = (loading) => ({ width: "100%", padding: "13px", background: loading ? "#f0ede8" : "#D85A30", color: loading ? "#999" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 4 });
