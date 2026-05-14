import { useState, useEffect } from "react";
import { getRestaurant, getReviews, postReview, deleteReview } from "../api";
import EditRestaurantPage from "./EditRestaurantPage";
import MapView from "../components/MapView";
import { isOpenNow, getTodayHours } from "../components/WeeklyHours";

const accent = "#D85A30";

export default function DetailPage({ id, saved, toggleSave, onBack }) {
  const [r, setR] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("info");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const openStatus = r ? isOpenNow(r.weeklyHours) : null;
  const todayHours = r ? getTodayHours(r.weeklyHours) : null;
  const isSaved = saved.includes(id);

  useEffect(() => {
    const load = async () => {
      try {
        const [restaurant, reviewList] = await Promise.all([
          getRestaurant(id),
          getReviews(id),
        ]);
        setR(restaurant);
        setReviews(reviewList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const submitReview = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const newReview = await postReview(id, { rating, text });
      setReviews([newReview, ...reviews]);
      setText(""); setRating(5); setPhotoPreview(null);
      setR(prev => ({ ...prev, reviewCount: (prev.reviewCount || 0) + 1 }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("確定刪除這則評論？")) return;
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 36 }}>🍽️</div>;
  if (error || !r) return <div style={{ padding: 24, color: "#cc0000" }}>⚠️ 載入失敗</div>;

  if (editing) return (
    <EditRestaurantPage
      restaurant={r}
      onBack={() => setEditing(false)}
      onSaved={(updated) => { setR(updated); setEditing(false); }}
      onDeleted={onBack}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7" }}>
      {/* Hero */}
      <div style={{ height: 180, background: r.coverImage ? "#000" : getBg(r.category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative", overflow: "hidden" }}>
        {r.coverImage
          ? <img src={r.coverImage} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
          : <span>{r.emoji || "🍽️"}</span>
        }
        <button onClick={onBack} style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        {user?.isAdmin && (
          <button onClick={() => setEditing(true)} style={{ position: "absolute", top: 14, left: 58, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: 20, padding: "0 12px", height: 36, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#D85A30", fontFamily: "inherit" }}>✏️ 編輯</button>
        )}
        <button onClick={() => toggleSave(id)} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{isSaved ? "❤️" : "🤍"}</button>
      </div>

      {/* 基本資訊卡 */}
      <div style={{ background: "#fff", margin: "0 14px", borderRadius: "0 0 16px 16px", padding: "14px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{r.name}</div>
          <div style={{ background: r.isOpen ? "#eafaf1" : "#f7f7f7", color: r.isOpen ? "#1a8c5b" : "#999", fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500 }}>{r.isOpen ? "營業中" : "休息中"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ color: accent, fontSize: 16 }}>★</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{r.avgRating || "新"}</span>
          <span style={{ color: "#bbb", fontSize: 13 }}>({r.reviewCount || 0} 則評論)</span>
        </div>
        {r.description && <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 10 }}>{r.description}</div>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip icon="🚶" text={`${r.walkMin} 分鐘`} />
          <Chip icon="💰" text={`$${r.priceMin}–$${r.priceMax}`} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", margin: "0 14px 10px", background: "#f0ede8", borderRadius: 12, padding: 3 }}>
        {["info", "reviews"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 9, background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1a1a1a" : "#999", fontWeight: tab === t ? 700 : 400, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {t === "info" ? "餐廳資訊" : `評論 (${reviews.length})`}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 14px 32px" }}>
        {tab === "info" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "0.5px solid #eae8e3" }}>
            {r.address && <InfoRow icon="📍" label="地址" value={r.address} />}
            {r.phone && <InfoRow icon="📞" label="電話" value={r.phone} />}
            {todayHours && <InfoRow icon="🕐" label="今日時間" value={todayHours} />}
            {r.hours && !todayHours && <InfoRow icon="🕐" label="營業時間" value={r.hours} />}
            {r.tags?.length > 0 && <InfoRow icon="🏷️" label="標籤" value={r.tags.join("、")} />}
         {r.address && <MapView address={r.address} name={r.name} />}
          </div>
          )}

        {tab === "reviews" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, border: "0.5px solid #eae8e3" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#1a1a1a" }}>✏️ 寫下你的評論</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, opacity: s <= rating ? 1 : 0.25, transition: "opacity 0.1s" }}>★</button>
                ))}
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="分享你的用餐體驗、推薦菜色..." style={{ width: "100%", height: 80, padding: 10, border: "0.5px solid #e0ede8", borderRadius: 10, fontSize: 13, resize: "none", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              <button onClick={submitReview} disabled={submitting} style={{ width: "100%", padding: "10px", background: submitting ? "#f0ede8" : accent, color: submitting ? "#999" : "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 8 }}>
                {submitting ? "發布中..." : "發布評論"}
              </button>
            </div>

            {reviews.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px", color: "#bbb" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                <div style={{ fontSize: 14 }}>還沒有評論，來第一個留言吧！</div>
              </div>
            )}

            {reviews.map(rv => (
              <div key={rv._id} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "0.5px solid #eae8e3" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fef3ee", color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>
                    {rv.user?.name?.charAt(0) || "?"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{rv.user?.name || "匿名"}</div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(rv.createdAt).toLocaleDateString("zh-TW")}</div>
                  </div>
                  <div style={{ color: accent, fontWeight: 700, fontSize: 14 }}>{"★".repeat(rv.rating)}</div>
                  {rv.user?._id === user?.id && (
                    <button onClick={() => handleDelete(rv._id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>🗑️</button>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{rv.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ icon, text }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f7f6f3", padding: "4px 10px", borderRadius: 99, fontSize: 12, color: "#666" }}>{icon} {text}</div>;
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "0.5px solid #f0ede8" }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: "#bbb", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: "#333" }}>{value}</div>
      </div>
    </div>
  );
}

function getBg(cat) {
  const map = { "台式": "#fff5f0", "麵食": "#f0f5ff", "健康": "#f0fff4", "日式": "#fff0f5", "飲料": "#fffbf0", "西式": "#f5f0ff", "小吃": "#fff8f0", "早餐": "#fffff0" };
  return map[cat] || "#f7f6f3";
}
