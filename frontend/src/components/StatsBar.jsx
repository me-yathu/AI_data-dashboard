import { Database, Columns, Hash, FileText } from 'lucide-react'

export default function StatsBar({ data }) {
  const stats = [
    { icon: FileText, label: 'File', value: data.filename },
    { icon: Database, label: 'Rows', value: data.row_count.toLocaleString() },
    { icon: Columns, label: 'Columns', value: data.col_count },
    { icon: Hash, label: 'Numeric cols', value: data.numeric_cols.length },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-white font-semibold truncate" title={String(value)}>{value}</p>
        </div>
      ))}
    </div>
  )
}
