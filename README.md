# ⚛️ Interactive Periodic Table

An interactive, responsive, and visually stunning modern Periodic Table of Elements web application built with **React 19**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Motion (Framer Motion)**.

Available in multiple languages: **English**, **简体中文 (Simplified Chinese)**, **繁體中文 (Traditional Chinese)**, **日本語 (Japanese)**, and **한국어 (Korean)**.

🌐 **Live Demo Online**: [https://chunshilaioqf.github.io/periodic_table/](https://chunshilaioqf.github.io/periodic_table/)

👉 [简体中文说明文档 (README in Simplified Chinese)](./README_zh.md)

---

## ✨ Features

### 1. 🔬 Complete 118 Elements Database & Quick View
- All 118 known elements rendered in standard periodic table layout (including Lanthanides and Actinides rows).
- **Empty-Space Quick View**: Hovering over any element dynamically displays its key metadata in the central empty grid space with smooth spring animations.
- Detailed historical background, discovery story, electronic structure, and physical constants for every element.

### 2. 📈 Interactive Property Trends (Powered by Recharts)
- Deep-dive into physical and chemical periodicity across rows and columns.
- **Dual Perspectives**:
  - **Across Period** (e.g., Period 1 to 7)
  - **Across Group** (e.g., Group 1 to 18)
- **Supported Properties**:
  - **Atomic Radius** (pm)
  - **Pauling Electronegativity**
  - **Melting Point** (°C)
  - **Boiling Point** (°C)
  - **First Ionization Energy** (kJ/mol)
  - **Density** (g/cm³)
- **Interactive Graphing**: Click any data point on the Recharts graph to seamlessly navigate to that element. Includes periodic law scientific explanations and min/max benchmarks.

### 3. 🪐 Interactive 3D-Like Bohr Model
- Real-time animated electron shells orbiting the nucleus based on the element's actual electron configuration ($2, 8, 18, 32\dots$).
- Smooth orbital rotations and glowing electron particles with quantum shell breakdowns.

### 4. ⚖️ Dual-Element Comparison Mode
- Select any element as a baseline, then pick another element to view side-by-side comparisons of atomic weight, element category, and electron arrangements.

### 5. 🧠 Chemistry Symbol Quiz
- Interactive chemistry knowledge game testing chemical symbols.
- Features score tracking, celebratory confetti on success, and real-time auditory feedback (Web Audio API synthesizers).

### 6. 🌐 Comprehensive Multi-Language Localization (i18n)
- 100% translated across 5 languages:
  - English (`en`)
  - 简体中文 (`zh-CN`)
  - 繁體中文 (`zh-TW`)
  - 日本語 (`ja`)
  - 한국어 (`ko`)
- Fully localizes element names, categories, descriptions, historical stories, chart labels, UI controls, and help guides.

### 7. 🎨 Personalization & UX Polish
- **Color Themes**: Light and Dark mode with seamless transitions.
- **Custom Accent Colors**: 7 curated palette accents (Blue, Red, Emerald, Amber, Purple, Pink, Cyan).
- **Easter Eggs**: Golden confetti explosion when inspecting Gold (**Au**).
- **Keyboard Shortcuts**: Press `/` to instantly focus search; press `Esc` to close any modal.
- **Data Export**: Export the full elements database to a JSON file with one click.
- **Scroll Progress & Return to Top**: Visual indicator of page scroll depth with smooth return-to-top button.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19 (`react`, `react-dom`) |
| **Language** | TypeScript |
| **Build Tool & Bundler** | Vite 6 |
| **Styling** | Tailwind CSS v4, Glassmorphism design tokens |
| **Charts & Visualization** | Recharts v2 |
| **Animations** | Motion (`motion/react`) |
| **Icons** | Lucide React |
| **Effects & Audio** | Canvas Confetti, Web Audio API |

---

## 📁 Directory Structure

```text
├── src/
│   ├── components/
│   │   ├── BohrModel.tsx          # Dynamic SVG Bohr atomic electron shell visualizer
│   │   └── ElementTrends.tsx      # Recharts periodic property trends visualization
│   ├── data/
│   │   ├── elementProperties.ts   # Accurate dataset for physical constants (1-118)
│   │   ├── elements.ts            # Core element definitions, periods, groups, weights
│   │   └── translations.ts        # Comprehensive i18n dictionaries (en, zh-CN, zh-TW, ja, ko)
│   ├── lib/
│   │   └── utils.ts               # Utility helpers & electron configuration algorithms
│   ├── types.ts                   # TypeScript interfaces & category types
│   ├── App.tsx                    # Main application container & modal management
│   ├── index.css                  # Tailwind CSS imports & category color schemes
│   └── main.tsx                   # React DOM application mount entry
├── index.html                     # HTML5 entry with OpenGraph metadata
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # TypeScript compiler options
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm, pnpm, or bun

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
|---|---|
| `/` | Focus search bar immediately |
| `Esc` | Close any open modal dialog (Detail, Quiz, Settings, Help, Compare) |

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and adapt it for educational and non-commercial purposes.
