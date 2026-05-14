import { useState, useEffect } from "react";
import { getRestaurants } from "../api";

const accent = "#D85A30";

export default function TodayPage({ goDetail }) {
  const [budget, setBudget] = useState("不限");
  const [distance, setDistance] = useState("不限");
  const [taste, setTaste] = useState("不限");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRestaurants, setAllRestaurants] = useState([]);

  useEffect(() => {
    getRestaurants().then(setAllRestaurants).catch(() => {});
  }, []);

  const recommend = async () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      let list = allRestaurants.filter((r) => r.isOpen);
      if (budget === "$60 以下") list = list.filter((r) => r.priceMin <= 60);
      if (budget === "$60–120") list = list.filter((r) => r.priceMin <= 120);
      if (distance === "5分鐘內") list = list.filter((r) => r.walkMin <= 5);
      if (distance === "10分鐘內") list = list.filter((r) => r.walkMin <= 10);
      if (taste !== "不限") list = list.filter((r) => r.category === taste || (r.tags || []).some(t => t.includes(taste)));
      if (list.length === 0) list = allRestaurants.filter((r) => r.isOpen);
      if (list.length === 0) { setLoading(false); return; }
      const pick = list[Math.floor(Math.random() * list.length)];
      setResult(pick);
      setLoading(false);
    }, 1200);
  };

  const opts = {
    budget: ["不限", "$60 以下", "$60–120", "$120 以上"],
    distance: ["不限", "5分鐘內", "10分鐘內"],
    taste: ["不限", "台式", "麵食", "健康", "日式", "飲料", "西式", "小吃", "早餐"],
  };

  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>🎲 今天吃什麼？</div>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>設定條件，讓 App 幫你決定！</div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "0.5px solid #eae8e3" }}>
        <FilterSection label="💰 預算" options={opts.budget} value={budget} onChange={setBudget} />
        <FilterSection label="🚶 距離" options={opts.distance} value={distance} onChange={setDistance} />
        <FilterSection label="🍽️ 口味" options={opts.taste} value={taste} onChange={setTaste} />
      </div>

      <button onClick={recommend} disabled={loading || allRestaurants.length === 0} style={{ width: "100%", padding: "14px", borderRadius: 14, background: loading || allRestaurants.length === 0 ? "#f0ede8" : accent, color: loading || allRestaurants.length === 0 ? "#999" : "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
        {allRestaurants.length === 0 ? "載入餐廳中..." : loading ? "🎲 抽籤中..." : "幫我選！"}
      </button>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, animation: "spin 0.8s linear infinite", display: "inline-block" }}>🎲</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ marginTop: 12, color: "#999", fontSize: 14 }}>正在幫你找最適合的餐廳...</div>
        </div>
      )}

      {result && !loading && (
        <div style={{ marginTop: 20, animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both" }}>
          <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#999" }}>AI 為你推薦</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: accent }}>今天就吃這個！🎉</div>
          </div>
          <div onClick={() => goDetail(result._id)} style={{ background: "#fff", borderRadius: 20, border: `2px solid ${accent}`, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ height: 120, background: getBg(result.category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>{result.emoji || "🍽️"}</div>
            <div style={{ padding: "16px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{result.name}</div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>{(result.tags || []).join(" · ")}</div>
              {result.description && <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>{result.description}</div>}
              <div style={{ display: "flex", gap: 10, fontSize: 13, color: "#888" }}>
                <span>★ {result.avgRating || "新"}</span>
                <span>🚶 {result.walkMin} 分鐘</span>
                <span>💰 ${result.priceMin}–${result.priceMax}</span>
              </div>
            </div>
          </div>
          <button onClick={recommend} style={{ width: "100%", marginTop: 10, padding: "12px", background: "#f7f6f3", border: "none", borderRadius: 12, fontSize: 14, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
            🔄 換一個
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSection({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)} style={{ padding: "5px 12px", borderRadius: 99, border: "0.5px solid", borderColor: value === o ? accent : "#e0ded8", background: value === o ? "#fff5f0" : "#fff", color: value === o ? accent : "#666", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: value === o ? 600 : 400, transition: "all 0.15s" }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function getBg(cat) {
  const map = { "台式": "#fff5f0", "麵食": "#f0f5ff", "健康": "#f0fff4", "日式": "#fff0f5", "飲料": "#fffbf0", "西式": "#f5f0ff", "小吃": "#fff8f0", "早餐": "#fffff0" };
  return map[cat] || "#f7f6f3";
}
