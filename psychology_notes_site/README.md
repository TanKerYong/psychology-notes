# 生活心理學小筆記

一個以繁體中文介紹心理學概念的靜態小網站：可搜尋、按類別篩選、收藏主題與完成小測驗。

## 開啟方式
直接打開 `index.html` 即可瀏覽（推薦用本機伺服器測試）：

```bash
python -m http.server 8000
```

然後在瀏覽器開啟 `http://localhost:8000`。

## 專案內容
- `index.html`：首頁
- `concepts.html`：概念清單、搜尋、篩選、收藏
- `article.html`：單一心理學概念詳情
- `quiz.html`：選擇題練習
- `about.html`：專案介紹
- `assets/data.js`：所有概念和題目
- `assets/app.js`：網站互動程式
- `assets/style.css`：共用樣式
- `AGENTS.md`：給 AI 使用的專案規則（重點交件）

## GitHub Pages 發布
1. 在 GitHub 建立一個 **Public** Repository，例如 `psychology-notes`。
2. 把本專案根目錄的所有檔案、`assets` 資料夾上傳到該 Repository 的根目錄（不是多包一層資料夾）。
3. 前往 **Settings → Pages → Build and deployment → Source: Deploy from a branch**。
4. 選擇 `main`、`/(root)` 並按 **Save**。
5. 完成部署後，可在 Pages 頁面找到 **Visit site** 連結。

## 以後怎麼新增內容？
請先讀 `AGENTS.md`。通常只要在 `assets/data.js` 的 `PSYCHOLOGY_TOPICS` 增加一筆概念資料，頁面和測驗就會同步新增，無需再手動做一份 HTML。

## 專案限制
沒有登入系統，也不會將收藏記錄傳送到伺服器。內容為教育用途，不提供個人心理健康評估與診斷。
