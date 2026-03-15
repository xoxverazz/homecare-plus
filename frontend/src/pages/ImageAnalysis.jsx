import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, FileText, Brain, AlertTriangle, CheckCircle, Info, RotateCcw, Loader } from 'lucide-react'
import { imageAnalysisService } from '../services/api'
import toast from 'react-hot-toast'

const analysisTypes = [
  { key: 'xray',   label: 'X-Ray',         icon: Image,    desc: 'Chest, bone, or other radiographs' },
  { key: 'skin',   label: 'Skin Photo',     icon: Image,    desc: 'Skin conditions, rashes, or lesions' },
  { key: 'report', label: 'Medical Report', icon: FileText, desc: 'Lab reports, blood tests, pathology' },
  { key: 'scan',   label: 'CT / MRI Scan',  icon: Brain,    desc: 'Cross-sectional imaging analysis' },
]


export default function ImageAnalysis() {
  const [analysisType, setAnalysisType] = useState('xray')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => {
    if (!accepted.length) return
    const f = accepted[0]
    setFile(f)
    setResult(null)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a file first'); return }
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('type', analysisType)
      const { data } = await imageAnalysisService.analyze(form)
      setResult(data)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Analysis failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setFile(null); setPreview(null); setResult(null) }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">AI Medical Image Analysis</h1>
          <p className="section-subtitle text-sm">Upload X-rays, scans, skin photos, or reports for AI-powered analysis</p>
        </div>
        {result && <button onClick={reset} className="btn-secondary text-sm px-4 py-2"><RotateCcw size={14} /> New Analysis</button>}
      </div>

      {!result ? (
        <div className="space-y-5">
          {/* Type selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analysisTypes.map(({ key, label, icon: Icon, desc }) => (
              <button key={key} onClick={() => setAnalysisType(key)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  analysisType === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'
                }`}>
                <Icon size={20} className={analysisType === key ? 'text-blue-600' : 'text-slate-400'} />
                <p className={`font-semibold text-sm mt-2 ${analysisType === key ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          {/* Upload zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-800'
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-contain shadow-md" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{file?.name}</p>
                <p className="text-xs text-slate-400">{(file?.size / 1024 / 1024).toFixed(2)} MB — Click to change</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-3">
                <FileText size={40} className="text-blue-500" />
                <p className="font-medium text-slate-700 dark:text-slate-300">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB — Click to change</p>
              </div>
            ) : (
              <>
                <Upload size={36} className="text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {isDragActive ? 'Drop the file here' : 'Drag and drop your file, or click to select'}
                </p>
                <p className="text-xs text-slate-400">Supports JPG, PNG, PDF — Max 20 MB</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              AI analysis is for informational purposes only and does not constitute a medical diagnosis. Always consult a healthcare professional.
            </p>
          </div>

          <button onClick={handleAnalyze} disabled={!file || loading} className="btn-primary w-full justify-center py-3.5">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" /> Analyzing with AI...
              </span>
            ) : <><Brain size={18} /> Analyze with AI</>}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Confidence */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Analysis Complete</h2>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{result.confidence}%</p>
                <p className="text-xs text-slate-500">AI Confidence</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
              />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-4">{result.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={17} className="text-blue-500" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Key Findings</h3>
              </div>
              <ul className="space-y-2">
                {result.key_findings.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={17} className="text-purple-500" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Possible Conditions</h3>
              </div>
              <ul className="space-y-2">
                {result.possible_conditions.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle size={14} className="text-blue-500 flex-shrink-0 mt-0.5" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">{result.disclaimer}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
