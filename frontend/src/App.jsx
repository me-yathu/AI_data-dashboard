import { useState } from 'react'
import { BarChart2, Github, RefreshCw } from 'lucide-react'
import FileUpload from './components/FileUpload.jsx'
import StatsBar from './components/StatsBar.jsx'
import InsightsBox from './components/InsightsBox.jsx'
import ChartPanel from './components/ChartPanel.jsx'
import ChatBox from './components/ChatBox.jsx'
import DataPreview from './components/DataPreview.jsx'
import { downloadPDF } from './utils/downloadReport'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const reset = () => setResult(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-blue-950/20 pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* LEFT SIDE - LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="font-semibold text-white leading-none">
                AI Data Dashboard
              </h1>
              <p className="text-xs text-white/30 mt-0.5">
                Upload CSV → Get instant insights
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - ACTIONS */}
          <div className="flex items-center gap-3">

            {result && (
              <>
                <button
                 onClick={() => downloadPDF(result, result.charts.length)}
                  className="download-btn text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Download PDF
                </button>

                <button
                  onClick={reset}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  New file
                </button>
              </>
            )}

            <a
              href="https://github.com/yourusername/ai-data-dashboard"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>

          </div>

        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-6xl mx-auto px-6 py-10">

        {/* Upload screen */}
        {!result && (
          <div className="max-w-xl mx-auto">

            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold text-white mb-3">
                Understand your data<br />
                <span className="text-violet-400">in seconds</span>
              </h2>

              <p className="text-white/40">
                Upload any CSV file and get AI-generated charts,<br />
                insights, and answers instantly.
              </p>
            </div>

            <FileUpload
              onResult={setResult}
              loading={loading}
              setLoading={setLoading}
            />

            <div className="flex justify-center gap-3 flex-wrap mt-8">
              {['Auto charts', 'AI insights', 'Ask questions', 'Free to use'].map(f => (
                <span
                  key={f}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40"
                >
                  {f}
                </span>
              ))}
            </div>

          </div>
        )}

        {/* Results screen */}
        {result && result.charts && (
          <div id="report-content" className="space-y-6">
            <div id="stats-section">
              <StatsBar data={result} />
            </div><div id="insights-section">
              <InsightsBox
                data={{
                  filename: result?.filename || "",
                  summary: result?.summary || "",
                  ai_insight: result?.ai_insight || ""
                }}
              />
            </div>

            <ChartPanel charts={result.charts} />
            <div id="table-section">
              <DataPreview
                preview={result.preview}
                columns={result.columns}
              />
            </div>

            <ChatBox />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative text-center py-8 text-xs text-white/15">
        Built with Python · FastAPI · React · Gemini API
      </footer>

    </div>
  )
}