const BASE_URL = "http://localhost:3000/api";

// 取得 token
const getToken = () => localStorage.getItem("token");

// 共用 fetch 函數
const api = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "發生錯誤");
  return data;
};

// 餐廳 API
export const getRestaurants = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/restaurants${query ? "?" + query : ""}`);
};

export const getRestaurant = (id) => api(`/restaurants/${id}`);

// 評論 API
export const getReviews = (restaurantId) => api(`/reviews/${restaurantId}`);

export const postReview = (restaurantId, data) =>
  api(`/reviews/${restaurantId}`, { method: "POST", body: JSON.stringify(data) });

export const deleteReview = (reviewId) =>
  api(`/reviews/${reviewId}`, { method: "DELETE" });

// 會員 API
export const login = (data) =>
  api("/auth/login", { method: "POST", body: JSON.stringify(data) });

export const register = (data) =>
  api("/auth/register", { method: "POST", body: JSON.stringify(data) });
