import { useState } from "react";
import HomePage from "./pages/HomePage";
import TodayPage from "./pages/TodayPage";
import ProfilePage from "./pages/ProfilePage";
import DetailPage from "./pages/DetailPage";
import AuthPage from "./pages/AuthPage";
import AddRestaurantPage from "./pages/AddRestaurantPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [saved, setSaved] = useState([]);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const toggleSave = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const goDetail = (id) => { setSelectedId(id); setPage("detail"); };
  const handleLogin = (userData) => { setUser(userData); setPage("home"); };
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setPage("home"); };
  const handleUpdateUser = (updatedUser) => { setUser(updatedUser); localStorage.setItem("user", JSON.stringify(updatedUser)); };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  const navItems = [
    { key: "home", label: "探索", icon: "🔍" },
    { key: "add", label: "新增", icon: "➕" },
    { key: "today", label: "今天吃", icon: "🎲" },
    { key: "saved", label: "收藏", icon: "❤️" },
    { key: "profile", label: "我的", icon: "👤" },
  ];

  return (
    <div style={{ fontFamily: "'Noto Sans TC', sans-serif", minHeight: "100vh", background: "#faf9f7", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 72 }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet" />

      {page === "home" && <HomePage saved={saved} toggleSave={toggleSave} goDetail={goDetail} />}
      {page === "today" && <TodayPage goDetail={goDetail} />}
      {page === "saved" && <HomePage saved={saved} toggleSave={toggleSave} goDetail={goDetail} filterSaved />}
      {page === "profile" && <ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
      {page === "detail" && <DetailPage id={selectedId} saved={saved} toggleSave={toggleSave} onBack={() => setPage("home")} />}
      {page === "add" && <AddRestaurantPage onBack={() => setPage("home")} onAdded={() => setPage("home")} />}

      {page !== "detail" && page !== "add" && (
        <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderTop: "0.5px solid #e8e6e0", display: "flex", zIndex: 100 }}>
          {navItems.map((item) => (
            <button key={item.key} onClick={() => setPage(item.key)} style={{ flex: 1, padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: page === item.key ? 700 : 400, color: page === item.key ? "#D85A30" : "#999", transition: "color 0.15s" }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
