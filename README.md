# 神田明神 婚禮網站

侯岳岑・莊家焮 ｜ 2027 年 3 月・東京 神田明神 神前式

## 要改資料時看這裡

婚禮資料集中在 [`src/content/wedding.ts`](src/content/wedding.ts)，文案在 [`src/content/copy.ts`](src/content/copy.ts)。
改這兩個檔就好，不必動版面程式。

| 想做的事 | 改哪裡 |
| --- | --- |
| 婚禮日期定案、啟用倒數計時 | `wedding.date`：`confirmed` 改 `true`，填 `iso`（例 `'2027-04-13'`）與 `time`（例 `'14:30'`） |
| 換成你們自己的照片 | 圖片放進 `public/images/`，把 `wedding.photos.hero.src` 改成 `asset('images/檔名.jpg')`，並把該張的 `credit` / `creditUrl` 整段刪掉、`isPlaceholder` 改 `false` |
| 開放 RSVP 表單 | `wedding.rsvp.formUrl` 填 Google 表單網址，按鈕會自動啟用；`lineUrl`、`email` 同理 |
| 改任何一種語言的文字 | `copy.ts` 裡的 `zh` / `ja` / `en`，三者 key 必須一致，少一個 TypeScript 會報錯 |

尚未確定的資料一律留 `null`，畫面會顯示「待確認」佔位——**請不要填假資料**。

## 圖片授權

目前站上兩張圖都取自 Wikimedia Commons，**換成自己的照片前請保留圖說的來源標示**：

- 首頁：二代歌川広重《東都三十六景・神田明神》，國立國會圖書館藏，**公有領域**（標示為禮貌，非義務）。
- 神社介紹：Hyppolyte de Saint-Rambert 攝，**CC BY-SA 4.0**——此授權**要求標示作者與授權條款**，圖說不可拿掉。

住宿區的飯店名稱、官網連結與徒步分鐘數均取自各飯店官方網站；官網自己標示不一致或未標示的，只寫車站不寫分鐘。

## 開發

```bash
npm install
npm run dev
```

## 部署

推上 `main` 後由 GitHub Actions 自動建置並發布到 GitHub Pages，網址為
`https://brianann2339.github.io/kanda-myojin-wedding/`。

網站掛了 `noindex, nofollow`，可要求搜尋引擎不建立索引，但**不等於加密或權限保護**——
GitHub Pages 的內容任何人只要知道網址都能開啟，因此站上不放住址、電話與證件資料。
