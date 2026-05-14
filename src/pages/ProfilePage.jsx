import { useState } from "react";
import MyReviewsPage from "./MyReviewsPage";
import SettingsPage from "./SettingsPage";

const accent = "#D85A30";

export default function ProfilePage({ user, onLogout, onUpdateUser }) {
  const [subPage, setSubPage] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);

  const handleUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    onUpdateUser(updatedUser);
  };

  if (subPage === "reviews") return <MyReviewsPage onBack={() => setSubPage(null)} />;
  if (subPage === "settings") return <SettingsPage user={currentUser} onBack={() => setSubPage(null)} onUpdate={handleUpdate} />;

  const initial = currentUser?.name?.charAt(0) || "?";

  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fef3ee", border: `3px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: accent, margin: "0 auto 12px" }}>{initial}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{currentUser?.name || "使用者"}</div>
        <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{currentUser?.email}</div>
        <div style={{ fontSize: 12, color: "#bbb", marginTop: 2 }}>彰化師範大學</div>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "0.5px solid #eae8e3", overflow: "hidden" }}>
        <MenuItem icon="📝" label="我的評論" onClick={() => setSubPage("reviews")} />
        <MenuItem icon="⚙️" label="偏好設定" onClick={() => setSubPage("settings")} />
        <MenuItem icon="🚪" label="登出" onClick={onLogout} color="#cc0000" last />
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, color, last }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: last ? "none" : "0.5px solid #f0ede8", cursor: "pointer" }}>
      <span style={{ fontSize: 18, marginRight: 12 }}>{icon}</span>
      <span style={{ fontSize: 14, color: color || "#333", flex: 1 }}>{label}</span>
      {!last && <span style={{ color: "#ccc" }}>›</span>}
    </div>
  );
}
