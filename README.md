# ffxiv-gil-sniffer

FFXIV crafting profit analyzer for Traditional Chinese servers.

繁中服的製作利潤分析器——查了才知道是不是在浪費水晶。

[![Deploy to GitHub Pages](https://github.com/irene-chou/ffxiv-gil-sniffer/actions/workflows/deploy.yml/badge.svg)](https://github.com/irene-chou/ffxiv-gil-sniffer/actions/workflows/deploy.yml)

**[Live Demo / 線上版](https://irene-chou.github.io/ffxiv-gil-sniffer/)**

## Features / 功能

- Fetches recipe data from XIVAPI and real-time market prices from Universalis
  （從 XIVAPI 取得配方、Universalis 取得板子價格）
- Calculates profit with 5% market tax factored in
  （計算扣稅後的利潤與利潤率）
- Filters by level, sale recency, and secret recipe books
  （可依等級、近期成交、秘籍篩選）
- Supports all 8 Traditional Chinese worlds on the 陸行鳥 data center
- Caches data locally to reduce API calls
- Available as both a web app and a CLI tool

## Usage / 使用方式

### Web

Visit the **[live demo](https://irene-chou.github.io/ffxiv-gil-sniffer/)**, pick a crafting job, and go.

### CLI

```bash
npm install
npm start
```

Follow the prompts to select a job, server, and optional level cap.

## Local Development / 本地開發

Requires **Node.js 22+**.

```bash
# Clone
git clone https://github.com/irene-chou/ffxiv-gil-sniffer.git
cd ffxiv-gil-sniffer

# Web app
cd web
npm install
npm run dev      # Vite dev server

# Production build
npm run build    # Downloads TC item names + bundles
npm run preview  # Preview the build
```

## Tech Stack / 技術架構

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite, Tailwind CSS 4, TanStack Query |
| CLI | Node.js, TypeScript, tsx |
| Data | XIVAPI v2, Universalis API |
| Deploy | GitHub Pages via GitHub Actions |

`src/` contains shared business logic (types, constants, profit calculator) used by both the web app and CLI. The web app lives in `web/` and imports shared code via a `@shared/*` Vite alias.

## Data Sources / 資料來源

- [Universalis](https://universalis.app) — market board prices / 市場資料
- [XIVAPI](https://xivapi.com) — recipe data / 配方資料
- [The Waking Sands (ffxiv-datamining-tc)](https://github.com/thewakingsands/ffxiv-datamining-tc) — Traditional Chinese translations / 繁中翻譯

## License

FINAL FANTASY XIV &copy; SQUARE ENIX CO., LTD. All Rights Reserved.
