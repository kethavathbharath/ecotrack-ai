# 🌿 EcoTrack AI – Carbon Footprint Awareness Platform

> **Hackathon-ready** · Full-stack React app · AI-powered · Beautiful UI

A production-ready web application that helps individuals understand, track, and reduce their carbon footprint through personalized AI insights powered by **Google Gemini**.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧮 **Calculator** | Calculate monthly CO₂ from transport, electricity, food & plastic |
| 🏆 **Eco Score** | 0–100 sustainability score with category (Champion / Good / Moderate / High) |
| 🤖 **AI Recommendations** | Gemini AI-powered personalized carbon reduction tips |
| 📊 **Dashboard** | Snapshot of footprint, score, trend chart, goal, and prediction |
| 📅 **History** | All past calculations with trend indicators and delete |
| 🎯 **Goals** | Set a monthly CO₂ target and track progress |
| 🏅 **Challenges** | Weekly green challenges with completion points |
| 📈 **Analytics** | Stacked bars, area charts, eco score trend, category averages |
| 🔮 **AI Prediction** | Linear regression + Gemini narrative for next month's footprint |

---

## 🗂️ Project Structure

```
foot prints/
├── public/
│   └── eco-icon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.jsx          # Sidebar navigation
│   │   └── ui/
│   │       └── UIComponents.jsx     # Reusable UI components
│   ├── hooks/
│   │   └── useEcoData.js            # Central state management hook
│   ├── pages/
│   │   ├── Landing.jsx              # Hero landing page
│   │   ├── Dashboard.jsx            # Main dashboard
│   │   ├── Calculator.jsx           # Footprint calculator
│   │   ├── History.jsx              # Calculation history
│   │   ├── Goals.jsx                # Goal setting & tracking
│   │   ├── Challenges.jsx           # Weekly challenges
│   │   ├── Analytics.jsx            # Charts & analytics
│   │   └── AIInsights.jsx           # AI recommendations
│   ├── services/
│   │   └── geminiService.js         # Gemini API integration
│   ├── utils/
│   │   ├── calculations.js          # Emission & score math
│   │   └── storage.js               # LocalStorage helpers
│   ├── App.jsx                      # Root component & routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── .env                             # Environment variables (don't commit!)
├── .env.example                     # Template for env vars
├── vercel.json                      # Vercel deployment config
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Get a free API key:** https://aistudio.google.com/app/apikey

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it into your `.env` file

> **Note:** The app works without a Gemini API key — it shows high-quality sample recommendations as fallback.

---

## ☁️ Deploying to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_GEMINI_API_KEY
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add `VITE_GEMINI_API_KEY` in **Settings → Environment Variables**
4. Deploy!

### Build Command
```
npm run build
```

### Output Directory
```
dist
```

---

## 🏗️ Tech Stack

- **React 18** – UI framework
- **Vite 5** – Build tool & dev server
- **Tailwind CSS 3** – Utility-first styling
- **Recharts** – Charts and data visualization
- **Lucide React** – Icon library
- **date-fns** – Date formatting
- **Google Gemini API** – AI recommendations
- **LocalStorage** – Client-side data persistence

---

## 📊 Emission Factors Used

| Category | Factor | Source |
|----------|--------|--------|
| Car | 0.21 kg CO₂/km | IPCC |
| Bus | 0.089 kg CO₂/km | IPCC |
| Electricity | 0.82 kg CO₂/kWh | India CEA |
| Vegetarian diet | 3.8 kg CO₂/day | Oxford Research |
| Mixed diet | 6.5 kg CO₂/day | Oxford Research |
| Non-veg diet | 9.2 kg CO₂/day | Oxford Research |
| Plastic waste | 6.0 kg CO₂/kg | EPA |

---

## 🎨 Design System

- **Dark eco-green theme** with glassmorphism cards
- **Glassmorphism** — frosted glass effects with backdrop blur
- **Glow effects** — green neon glows on key elements
- **Smooth animations** — fade-up, slide-in, floating elements
- **Mobile-first** — fully responsive across all screen sizes
- **Typography** — Inter + Plus Jakarta Sans from Google Fonts

---

## 📄 License

MIT © 2024 EcoTrack AI

---

> 🌱 *"Small actions, big impact. Every kilogram of CO₂ avoided matters."*
