import { Table } from 'lucide-react'

export default function DataPreview({ preview, columns }) {
  if (!preview || preview.length === 0) return null

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <Table className="w-4 h-4 text-white/40" />
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
          Data Preview (first 5 rows)
        </h2>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2.5 text-white/70 whitespace-nowrap font-mono text-xs">
                      {String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
