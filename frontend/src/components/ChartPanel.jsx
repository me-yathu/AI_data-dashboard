import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

import { Download } from "lucide-react"
import html2canvas from "html2canvas"

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 text-sm">
        <p className="text-white/50 mb-1 text-xs">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ChartPanel({ charts }) {
  if (!charts?.length) return null

  // DOWNLOAD FUNCTION (safe + stable)
  const downloadChartImage = async (chartId, filename = "chart") => {
    const element = document.getElementById(chartId)
    if (!element) return

    await new Promise(res => setTimeout(res, 200))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0a0a0f",
      ignoreElements: (el) => {
        // ensures ONLY download button is excluded if it accidentally appears inside
        return el.classList?.contains("download-btn")
      }
    })

    const img = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.href = img
    link.download = `${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  const ChartCardWrapper = ({ children, chart, i }) => (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 animate-fade-up">

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={() => downloadChartImage(`chart-${i}`, chart.title)}
        className="download-btn absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white p-2 rounded-lg transition"
      >
        <Download className="w-4 h-4" />
      </button>

      <h3 className="text-sm font-medium text-white/70 mb-4">
        {chart.title}
      </h3>

      {/* CHART WRAPPER (UNCHANGED) */}
      <div id={`chart-${i}`}>
        {children}
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
        Charts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {charts.map((chart, i) => {

          if (chart.type === 'bar') {
            return (
              <ChartCardWrapper key={i} chart={chart} i={i}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                    <XAxis dataKey={chart.x_key} tick={{ fill: '#ffffff50', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#ffffff50', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={chart.y_key} fill="#8b5cf6">
                      {chart.data.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCardWrapper>
            )
          }

          if (chart.type === 'line') {
            return (
              <ChartCardWrapper key={i} chart={chart} i={i}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                    <XAxis dataKey={chart.x_key} tick={{ fill: '#ffffff50', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#ffffff50', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey={chart.y_key}
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCardWrapper>
            )
          }

          if (chart.type === 'pie') {
            return (
              <ChartCardWrapper key={i} chart={chart} i={i}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chart.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {chart.data.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCardWrapper>
            )
          }

          return null
        })}

      </div>
    </div>
  )
}