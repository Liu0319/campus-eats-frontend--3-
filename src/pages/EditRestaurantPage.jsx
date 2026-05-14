import { useState } from "react";
import WeeklyHours from "../components/WeeklyHours";

const accent = "#D85A30";
const categories = ["台式", "麵食", "健康", "日式", "飲料", "西式", "小吃", "早餐"];
const emojiMap = { "台式": "🍱", "麵食": "🍜", "健康": "🥗", "日式": "🍣", "飲料": "🧋", "西式": "🍕", "小吃": "🥟", "早餐": "🍳" };

const defaultWeeklyHours = {
  mon: { open: "11:00", close: "21:00", closed: false },
  tue: { open: "11:00", close: "21:00", closed: false },
  wed: { open: "11:00", close: "21:00", closed: false },
  thu: { open: "11:00", close: "21:00", closed: false },
  fri: { open: "11:00", close: "21:00", closed: false },
  sat: { open: "11:00", close: "21:00", closed: false },
  sun: { open: "", close: "", closed: true },
};

export default function EditRestaurantPage({ restaurant, onBack, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    name: restaurant.name || "",
    category: restaurant.category || "台式",
    address: restaurant.address || "",
    phone: restaurant.phone || "",
    description: restaurant.description || "",
    priceMin: restaurant.priceMin || "",
    priceMax: restaurant.priceMax || "",
    walkMin: restaurant.walkMin || "",
    tags: (restaurant.tags || []).join("、"),
  });
  const [weeklyHours, setWeeklyHours] = useState(restaurant.weeklyHours || defaultWeeklyHours);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(restaurant.coverImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const token = localStorage.getItem("token");

  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setCoverImage(reader.result); setCoverPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!form.name || !form.address) return setError("請填寫餐廳名稱和地址");
    setLoading(true); setError(null);
    try {
      let coverUrl = restaurant.coverImage;
      if (coverImage) {
        const uploadRes = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image: coverImage }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message);
        coverUrl = uploadData.url;
      }

      const res = await fetch(`http://localhost:3000/api/restaurants/${restaurant._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          emoji: emojiMap[form.category] || "🍽️",
          priceMin: Number(form.priceMin) || 0,
          priceMax: Number(form.priceMax) || 999,
          walkMin: Number(form.walkMin) || 5,
          tags: form.tags ? form.tags.split("、").map(t => t.trim()) : [],
          coverImage: coverUrl,
          weeklyHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async () => {
    if (!confirm(`確定刪除「${restaurant.name}」？`)) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/restaurants/${restaurant._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("刪除失敗");
      onDeleted();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7" }}>
      <div style={{ background: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid #eae8e3", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", flex: 1 }}>編輯餐廳</div>
        <button onClick={deleteRestaurant} style={{ background: "none", border: "none", color: "#cc0000", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>🗑️ 刪除</button>
      </div>

      <div style={{ padding: "20px 16px 40px" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", cursor: "pointer" }}>
            <div style={{ height: 160, borderRadius: 16, border: `2px dashed ${coverPreview ? "transparent" : "#e0ded8"}`, background: coverPreview ? "transparent" : "#f7f6f3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
              {coverPreview ? <img src={coverPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center", color: "#bbb" }}><div style={{ fontSize: 36, marginBottom: 8 }}>📷</div><div style={{ fontSize: 14 }}>點擊上傳封面照片</div></div>}
              <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, padding: "4px 10px", borderRadius: 99 }}>點擊更換</div>
            </div>
            <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
          </label>
        </div>

        <Field label="餐廳名稱 *"><input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} /></Field>

        <Field label="類別 *">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(c => (
              <button key={c} onClick={() => set("category", c)} style={{ padding: "6px 14px", borderRadius: 99, border: "0.5px solid", borderColor: form.category === c ? accent : "#e0ded8", background: form.category === c ? accent : "#fff", color: form.category === c ? "#fff" : "#666", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
            ))}
          </div>
        </Field>

        <Field label="地址 *"><input value={form.address} onChange={e => set("address", e.target.value)} style={inputStyle} /></Field>
        <Field label="電話"><input value={form.phone} onChange={e => set("phone", e.target.value)} style={inputStyle} /></Field>
        <Field label="簡介"><textarea value={form.description} onChange={e => set("description", e.target.value)} style={{ ...inputStyle, height: 80, resize: "none" }} /></Field>
        <Field label="標籤（用、分隔）"><input value={form.tags} onChange={e => set("tags", e.target.value)} style={inputStyle} /></Field>

        <div style={{ display: "flex", gap: 10 }}>
          <Field label="最低消費" style={{ flex: 1 }}><input value={form.priceMin} onChange={e => set("priceMin", e.target.value)} type="number" style={inputStyle} /></Field>
          <Field label="最高消費" style={{ flex: 1 }}><input value={form.priceMax} onChange={e => set("priceMax", e.target.value)} type="number" style={inputStyle} /></Field>
          <Field label="步行分鐘" style={{ flex: 1 }}><input value={form.walkMin} onChange={e => set("walkMin", e.target.value)} type="number" style={inputStyle} /></Field>
        </div>

        <Field label="每週營業時間">
          <WeeklyHours value={weeklyHours} onChange={setWeeklyHours} />
        </Field>

        {error && <div style={{ background: "#fff5f5", border: "0.5px solid #ffcccc", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#cc0000", marginBottom: 14 }}>⚠️ {error}</div>}

        <button onClick={save} disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#f0ede8" : accent, color: loading ? "#999" : "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
          {loading ? "儲存中..." : "✅ 儲存變更"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return <div style={{ marginBottom: 14, ...style }}><div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>{label}</div>{children}</div>;
}

const inputStyle = { width: "100%", padding: "11px 14px", border: "0.5px solid #e0ede8", borderRadius: 10, fontSize: 14, color: "#333", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" };
