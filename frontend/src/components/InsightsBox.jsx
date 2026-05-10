import { Sparkles } from 'lucide-react'

export default function InsightsBox({ data }) {

  const lines = data.ai_insight
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  return (
    <div className="animate-fade-up bg-gradient-to-br from-violet-900/40 to-blue-900/30 border border-violet-500/30 rounded-2xl p-6">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-violet-300" />
        </div>
        <h2 className="font-semibold text-violet-200">AI Insights</h2>
        <span className="text-xs text-violet-400/60 ml-auto">
          Powered by Gemini
        </span>
      </div>

      {/* INSIGHTS */}
      <ul className="space-y-3">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed">
            <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>
            <span>{line.replace(/^[•\-*]\s*/, '')}</span>
          </li>
        ))}
      </ul>

    </div>
  )
}