# 🍱 CampusEats — 校園餐廳評價 App 前端

## 專案結構

```
campus-eats/
├── index.html              # 入口 HTML
├── vite.config.js          # Vite 設定
├── package.json
└── src/
    ├── index.jsx           # React 掛載點
    ├── App.jsx             # 主 App + 底部導覽列
    ├── data/
    │   └── restaurants.js  # 假資料（之後換成 API）
    └── pages/
        ├── HomePage.jsx    # 探索餐廳 + 搜尋 + 分類
        ├── DetailPage.jsx  # 餐廳詳細頁 + 評論
        ├── TodayPage.jsx   # 今天吃什麼（AI 推薦）
        └── ProfilePage.jsx # 個人頁面
```

## 快速開始

```bash
# 1. 安裝相依套件
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 打開瀏覽器
# http://localhost:5173
```

## 功能說明

### 🔍 探索頁 (HomePage)
- 搜尋餐廳名稱、料理類型
- 分類篩選（台式、麵食、健康、日式...）
- 餐廳卡片顯示評分、距離、價位
- 愛心收藏功能

### 🍽️ 詳細頁 (DetailPage)
- 餐廳基本資訊（地址、電話、營業時間）
- 評論列表
- 寫評論 + 星等評分

### 🎲 今天吃什麼 (TodayPage)
- 條件篩選（預算、距離、口味）
- 隨機推薦演算法
- 動畫顯示結果

### 👤 個人頁 (ProfilePage)
- 用戶資訊、統計數字
- 成就徽章

## 下一步：串接後端 API

目前資料來自 `src/data/restaurants.js`（假資料）。
之後把它換成 API 呼叫：

```js
// 範例：取得餐廳列表
const res = await fetch("http://localhost:3000/api/restaurants");
const data = await res.json();
```

## 技術棧
- **React 18** — UI 框架
- **Vite** — 開發工具
- **純 CSS-in-JS** — 不需要額外安裝 UI 套件
