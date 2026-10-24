# 物理知識圖譜

給 AP Physics 講義用的互動知識圖譜。介面是繁體中文；概念名稱、定義、公式與投影片原文維持講義英文。

目前內建 **AP Physics 1**（許老師講義）：180 個概念節點、11 個單元、479 條連結。圖譜資料與程式分開，之後放進 AP Physics 2 的 JSON 就會出現在課程選單。

## 環境

- Node.js 20 以上

## 本機執行

```bash
npm install
npm run dev
```

瀏覽器打開 [http://localhost:3000](http://localhost:3000)。

- `/` 圖譜：左側篩選與搜尋，中間圖，右側概念或連結詳情
- `/gaps` 缺口分析：講義順序與先備關係的檢查報告

常用操作：

- **先備階層**：由上往下，適合看先備順序（dagre）
- **力導向**：力導向配置（fcose）
- 點節點會凸顯它的相鄰概念；點連結可看引文與講義出處
- 公式若 `equations_verified_in_slide_text` 為 `false`，詳情會顯示 **待確認**
- 預設把單元畫成區塊，不畫 180 條 `part_of`。關閉「以區塊收納單元」後改畫歸屬連線
- 「隱藏推論連結」與「隱藏弱證據連結」可把 `inferred`、`label_mention_nearby` 從圖上拿掉

## 靜態建置

```bash
npm run generate
```

輸出在 `.output/public`，不含伺服器。本地預覽：

```bash
npx serve .output/public
```

Vercel 會自動辨識 Nuxt。這個專案沒有 server route；`/` 與 `/gaps` 都在建置時預渲染。若要純靜態部署，把建置指令設成 `npm run generate`，輸出目錄設成 `.output/public`。

## 測試

```bash
npm test
```

會檢查 AP Physics 1 的節點／連結數量，以及篩選（含弱證據、推論、單元區塊）與「只有節點、沒有連結」的舊格式。

## 更新或新增課程

每門課一個 JSON，檔名就是課程 id：

```text
data/courses/ap-physics-1.json
data/courses/ap-physics-1.gaps.md   # 選用，對應「缺口分析」
```

新增 AP Physics 2 時，放入 `data/courses/ap-physics-2.json`（以及選用的 `ap-physics-2.gaps.md`），不必改程式。重新執行 `npm run dev` 或 `npm run generate` 後，頁首的課程選單會出現新課程。

載入器會接受下面兩種形狀。

### 完整圖譜（目前的 AP Physics 1）

```json
{
  "meta": {
    "course": "AP Physics 1",
    "author": "Hsu Chun-Wei",
    "source_folder": "https://drive.google.com/...",
    "relations": { "prerequisite": "source should be understood before target" },
    "basis": { "grounded": "...", "inferred": "..." },
    "counts": { "nodes": 180, "edges_total": 479 }
  },
  "units": [
    { "id": "unit-ch01", "unit": "ch01", "label": "Ch 1 ...", "order": 1, "files": [] }
  ],
  "nodes": [
    {
      "id": "dimensional-analysis",
      "label": "Dimensional Analysis",
      "unit": "ch01",
      "unit_name": "Ch 1 ...",
      "unit_id": "unit-ch01",
      "type": "concept",
      "definition": "簡短英文定義",
      "slide_excerpt": "投影片原文",
      "equations": ["[v]=\\frac{[L]}{[T]}"],
      "equations_verified_in_slide_text": false,
      "source": {
        "file": "Chapter 1.pdf",
        "file_id": "...",
        "link": "https://drive.google.com/file/d/.../view",
        "page": 9,
        "slide_title": "Dimensional Analysis"
      }
    }
  ],
  "edges": [
    {
      "id": "e001",
      "source": "units-of-measurement",
      "target": "standard-prefixes",
      "relation": "prerequisite",
      "basis": "grounded",
      "note": "prefixes scale SI units",
      "cross_unit": false,
      "evidence": {
        "file": "Chapter 1.pdf",
        "file_id": "...",
        "link": "https://drive.google.com/file/d/.../view",
        "page": 4,
        "quote": "Units of Measurement",
        "kind": "label_mention_nearby"
      }
    }
  ]
}
```

`type`：`concept`、`equation`、`law`、`skill`。

`relation`：`prerequisite`、`derived_from`、`applies_to`、`contrasts_with`、`part_of`。

`basis`：`grounded`（講義有引文）、`inferred`（推論，圖上為虛線）。

`evidence.kind`：

- `targeted_phrase`：強證據，實線
- `label_mention_nearby`：弱證據，點線，可用篩選隱藏
- `source_slide`：`part_of` 用的來源頁

`part_of` 由概念指向 `unit-chXX`。預設不畫這些線，改以單元區塊呈現。

### 只有節點

邊還在整理時也可以先放這一種。沒有 `edges` 時圖上只有節點，詳情不會出現連結。

```json
{
  "course": "AP Physics 2",
  "author": "Hsu Chun-Wei",
  "units": { "ch01": "Ch 1 ..." },
  "nodes": [ { "id": "sample", "label": "Sample", "unit": "ch01", "type": "concept", "definition": "..." } ]
}
```

`units` 可以是 `{ "ch01": "章名" }`，或完整圖譜那種陣列。節點欄位用底線（`unit_name`、`slide_excerpt`）或駝峰都可以。

缺口分析是普通 Markdown（含表格）。檔名必須是 `<課程 id>.gaps.md`，放在同一個 `data/courses/` 目錄。
