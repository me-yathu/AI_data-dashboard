import { useState, useRef } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'

export default function FileUpload({ onResult, loading, setLoading }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file only')
      return
    }
    setError('')
    setFileName(file.name)
    setLoading(true)
    try {
      const { uploadCSV } = await import('../api/client.js')
      const result = await uploadCSV(file)
      onResult(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Make sure your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="w-full">
      <div
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${dragging
            ? 'border-violet-400 bg-violet-500/10'
            : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
          }
          ${loading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {/* Background glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-blue-600/5" />

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <div className="relative flex flex-col items-center gap-4">
          {loading ? (
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
              <Upload className="w-8 h-8 text-violet-400" />
            </div>
          )}

          <div>
            <p className="text-lg font-medium text-white/90">
              {loading ? 'Analysing your data...' : 'Drop your CSV here'}
            </p>
            <p className="text-sm text-white/40 mt-1">
              {loading ? 'AI is reading your dataset' : 'or click to browse files'}
            </p>
          </div>

          {fileName && !loading && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm text-white/60">
              <FileText className="w-4 h-4" />
              {fileName}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
      )}

      <p className="mt-3 text-xs text-white/25 text-center">
        Try the sample file in <code className="font-mono">/sample_data/sales_data.csv</code>
      </p>
    </div>
  )
}
