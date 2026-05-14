const days = [
  { key: "mon", label: "週一" },
  { key: "tue", label: "週二" },
  { key: "wed", label: "週三" },
  { key: "thu", label: "週四" },
  { key: "fri", label: "週五" },
  { key: "sat", label: "週六" },
  { key: "sun", label: "週日" },
];

export default function WeeklyHours({ value, onChange }) {
  const set = (day, field, val) => {
    onChange({ ...value, [day]: { ...value[day], [field]: val } });
  };

  return (
    <div>
      {days.map((d) => {
        const dayData = value[d.key] || {};
        return (
          <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, fontSize: 13, color: "#555", fontWeight: 500, flexShrink: 0 }}>{d.label}</div>
            {dayData.closed ? (
              <div style={{ flex: 1, fontSize: 13, color: "#bbb" }}>公休</div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                <input
                  type="time"
                  value={dayData.open || ""}
                  onChange={e => set(d.key, "open", e.target.value)}
                  style={timeStyle}
                />
                <span style={{ fontSize: 12, color: "#bbb" }}>至</span>
                <input
                  type="time"
                  value={dayData.close || ""}
                  onChange={e => set(d.key, "close", e.target.value)}
                  style={timeStyle}
                />
              </div>
            )}
            <button
              onClick={() => set(d.key, "closed", !dayData.closed)}
              style={{
                padding: "4px 10px", borderRadius: 99, border: "0.5px solid",
                borderColor: dayData.closed ? "#cc0000" : "#e0ded8",
                background: dayData.closed ? "#fff5f5" : "#fff",
                color: dayData.closed ? "#cc0000" : "#999",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              }}
            >{dayData.closed ? "公休" : "正常"}</button>
          </div>
        );
      })}
    </div>
  );
}

const timeStyle = {
  padding: "6px 8px", border: "0.5px solid #e0ede8",
  borderRadius: 8, fontSize: 13, fontFamily: "inherit",
  outline: "none", flex: 1,
};

// 判斷現在是否營業的工具函數
export function isOpenNow(weeklyHours) {
  if (!weeklyHours) return null;
  const now = new Date();
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayKey = dayKeys[now.getDay()];
  const today = weeklyHours[todayKey];
  if (!today || today.closed) return false;
  if (!today.open || !today.close) return null; // 未設定

  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

// 取得今天營業時間文字
export function getTodayHours(weeklyHours) {
  if (!weeklyHours) return null;
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayLabels = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  const todayKey = dayKeys[new Date().getDay()];
  const todayLabel = dayLabels[new Date().getDay()];
  const today = weeklyHours[todayKey];
  if (!today || today.closed) return `${todayLabel} 公休`;
  if (!today.open || !today.close) return null;
  return `${todayLabel} ${today.open}–${today.close}`;
}
