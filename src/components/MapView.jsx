import { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyAOaTjZb8tx1akWsteEcGpE9JCLFmaxrWY";

export default function MapView({ address, name }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const initMap = async () => {
      try {
        const geoRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + " 彰化")}&key=${GOOGLE_MAPS_API_KEY}&language=zh-TW`
        );
        const geoData = await geoRes.json();

        if (geoData.status !== "OK" || !geoData.results[0]) {
          setError("找不到此地址");
          setLoading(false);
          return;
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        if (!window.google) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=zh-TW`;
          script.async = true;
          script.onload = () => renderMap(lat, lng);
          script.onerror = () => { setError("地圖載入失敗"); setLoading(false); };
          document.head.appendChild(script);
        } else {
          renderMap(lat, lng);
        }
      } catch (err) {
        setError("地圖載入失敗");
        setLoading(false);
      }
    };

    const renderMap = (lat, lng) => {
      if (!mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: name,
        animation: window.google.maps.Animation.DROP,
      });
      setLoading(false);
    };

    initMap();
  }, [address]);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " " + name)}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", border: "0.5px solid #eae8e3" }}>
      {loading && !error && (
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f6f3", color: "#bbb", fontSize: 14 }}>
          🗺️ 載入地圖中...
        </div>
      )}
      {error && (
        <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f6f3", color: "#bbb", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}
      <div ref={mapRef} style={{ height: !loading && !error ? 200 : 0 }} />
      <button onClick={openGoogleMaps} style={{ width: "100%", padding: "10px", background: "#fff", border: "none", borderTop: "0.5px solid #eae8e3", fontSize: 13, color: "#1a73e8", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        🗺️ 在 Google Maps 中開啟
      </button>
    </div>
  );
}
