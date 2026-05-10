# AI Data Dashboard 🧠📊

Upload any CSV file and instantly get auto-generated charts, AI-written insights, and the ability to ask natural language questions about your data.

---

## Features

- **Auto Charts** — Bar, line, and pie charts generated automatically from your CSV
- **AI Insights** — Plain-English summary of key patterns (powered by Google Gemini)
- **Ask Questions** — Chat with your data in plain English
- **Data Preview** — See a table of the first 5 rows instantly
- **Any CSV** — Works with sales data, student scores, survey results, anything

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Pandas |
| AI | Google Gemini API (gemini-1.5-flash) |
| Deployment | Vercel (frontend) + Render (backend) |

---

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Gemini API key to .env
uvicorn main:app --reload
# Backend runs at http://localhost:8000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm install jspdf html2canvas lucide-react
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Open your browser
Go to `http://localhost:5173` and upload the sample CSV from `/sample_data/sales_data.csv`

---

## Get a Free Gemini API Key (2 minutes, no credit card)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Copy the key into `backend/.env` as `GEMINI_API_KEY=your_key_here`

---

## Project Structure

```
ai-data-dashboard/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── analyzer.py      # Pandas CSV analysis + chart generation
│   ├── ai_insights.py   # Gemini API integration
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── FileUpload.jsx
│           ├── ChartPanel.jsx
│           ├── InsightsBox.jsx
│           ├── ChatBox.jsx
│           ├── StatsBar.jsx
│           └── DataPreview.jsx
└── sample_data/
    └── sales_data.csv
```
