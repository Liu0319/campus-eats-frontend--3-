import { useState, useEffect } from "react";
import { getRestaurants } from "../api";

const accent = "#D85A30";
const categories = ["全部", "台式", "麵食", "健康", "日式", "飲料", "西式"];

export default function HomePage({ saved, toggleSave, goDetail, filterSaved }) {
  const [cat, setCat] = useState("全部");
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (cat !== "全部") params.category = cat;
        if (search) params.search = search;
        const data = await getRestaurants(params);
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [cat, search]);

  let list = restaurants;
  if (filterSaved) list = list.filter((r) => saved.includes(r._id));

  return (
    <div>
      <div style={{ padding: "20px 20px 0", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", letterSpacing: -0.5 }}>
              {filterSaved ? "❤️ 我的收藏" : "今天吃什麼？"}
            </div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>彰化師範大學 周邊</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#fef3ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔔</div>
        </div>

        {!filterSaved && (
          <div style={{ position: "relative", marginBottom: 14 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#bbb" }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋餐廳、料理類型..." style={{ width: "100%", padding: "10px 12px 10px 36px", border: "0.5px solid #e8e6e0", borderRadius: 12, fontSize: 14, background: "#f7f6f3", color: "#333", outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        {!filterSaved && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 14, scrollbarWidth: "none" }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, border: "0.5px solid", borderColor: cat === c ? accent : "#e0ded8", background: cat === c ? accent : "#fff", color: cat === c ? "#fff" : "#666", fontSize: 13, cursor: "pointer", fontWeight: cat === c ? 500 : 400, transition: "all 0.15s" }}>{c}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "12px 16px 8px" }}>
        {loading && <div style={{ textAlign: "center", padding: "40px", color: "#bbb" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div><div style={{ fontSize: 14 }}>載入中...</div></div>}

        {error && <div style={{ background: "#fff5f5", border: "0.5px solid #ffcccc", borderRadius: 12, padding: 16, textAlign: "center", color: "#cc0000", fontSize: 13 }}>⚠️ {error}<br /><span style={{ color: "#999", fontSize: 12 }}>請確認後端伺服器是否啟動</span></div>}

        {!loading && !error && list.length === 0 && <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb" }}><div style={{ fontSize: 40, marginBottom: 12 }}>{filterSaved ? "💔" : "🍽️"}</div><div style={{ fontSize: 15 }}>{filterSaved ? "還沒有收藏的餐廳" : "資料庫還沒有餐廳，去後端新增看看！"}</div></div>}

        {!loading && !error && !filterSaved && !search && cat === '全部' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 10, letterSpacing: '0.04em' }}>🏆 熱門排行</div>
            {list.slice(0, 3).map((r, i) => (
              <div key={r._id} onClick={() => goDetail(r._id)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 14, border: '0.5px solid #eae8e3', padding: '10px 14px', marginBottom: 8, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{r.emoji || '🍽️'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{(r.tags || []).slice(0, 2).join(' · ')}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#D85A30' }}>★ {r.avgRating || '新'}</div>
              </div>
            ))}
            <div style={{ height: 1, background: '#f0ede8', margin: '16px 0 8px' }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 10, letterSpacing: '0.04em' }}>所有餐廳</div>
          </div>
        )}
        {!loading && !error && list.map((r, i) => (
          <RestaurantCard key={r._id} r={r} saved={saved.includes(r._id)} onSave={() => toggleSave(r._id)} onTap={() => goDetail(r._id)} delay={i * 40} />
        ))}
      </div>
    </div>
  );
}

function RestaurantCard({ r, saved, onSave, onTap, delay }) {
  return (
    <div onClick={onTap} style={{ background: "#fff", borderRadius: 16, border: "0.5px solid #eae8e3", marginBottom: 12, overflow: "hidden", cursor: "pointer", animation: `fadeUp 0.3s ease both`, animationDelay: `${delay}ms` }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ height: 80, background: r.coverImage ? "#000" : getBg(r.category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, position: "relative", overflow: "hidden" }}>
        {r.coverImage
          ? <img src={r.coverImage} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
          : <span>{r.emoji || "🍽️"}</span>
        }
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} style={{ position: "absolute", top: 10, right: 12, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{saved ? "❤️" : "🤍"}</button>
        <div style={{ position: "absolute", top: 10, left: 12, background: r.isOpen ? "#eafaf1" : "#f7f7f7", color: r.isOpen ? "#1a8c5b" : "#999", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99 }}>{r.isOpen ? "營業中" : "休息中"}</div>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{r.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13 }}>
            <span style={{ color: "#D85A30" }}>★</span>
            <span style={{ fontWeight: 600 }}>{r.avgRating || "新"}</span>
            <span style={{ color: "#bbb" }}>({r.reviewCount || 0})</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#aaa", margin: "4px 0 8px" }}>{(r.tags || []).join(" · ")}</div>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#888" }}>
          <span>🚶 {r.walkMin} 分鐘</span>
          <span>💰 ${r.priceMin}–${r.priceMax}</span>
        </div>
      </div>
    </div>
  );
}

function getBg(cat) {
  const map = { "台式": "#fff5f0", "麵食": "#f0f5ff", "健康": "#f0fff4", "日式": "#fff0f5", "飲料": "#fffbf0", "西式": "#f5f0ff" };
  return map[cat] || "#f7f6f3";
}
