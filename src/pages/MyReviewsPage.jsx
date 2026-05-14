import { useState, useEffect } from "react";

const accent = "#D85A30";

export default function MyReviewsPage({ onBack }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/reviews/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!confirm("確定刪除這則評論？")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert("刪除失敗");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7" }}>
      <div style={{ background: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid #eae8e3", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a" }}>我的評論</div>
      </div>

      <div style={{ padding: "16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#bbb" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <div>載入中...</div>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
            <div style={{ fontSize: 15, color: "#aaa" }}>還沒有評論</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>去餐廳頁面留下第一則評論吧！</div>
          </div>
        )}

        {reviews.map((rv) => (
          <div key={rv._id} style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: "0.5px solid #eae8e3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{rv.restaurant?.name || "已刪除的餐廳"}</div>
                <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{new Date(rv.createdAt).toLocaleDateString("zh-TW")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ color: accent, fontWeight: 700, fontSize: 14 }}>{"★".repeat(rv.rating)}</div>
                <button onClick={() => handleDelete(rv._id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18 }}>🗑️</button>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{rv.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
