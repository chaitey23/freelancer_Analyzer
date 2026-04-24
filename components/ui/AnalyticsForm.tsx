'use client'
import { useState, useRef, useEffect } from 'react'
import { Loader2, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ChevronDown } from 'lucide-react'
import axiosInstance from '@/lib/axios'
interface Report {
    trustScore: number
    summary: string
    strengths: string[]
    weaknesses: string[]
    recommendation: string
}
const PLATFORMS = [
    { value: 'Upwork', label: 'Upwork', icon: 'U', cls: 'bg-green-500/10 text-green-400' },
    { value: 'Fiverr', label: 'Fiverr', icon: 'F', cls: 'bg-emerald-500/10 text-emerald-400' },
    { value: 'Both', label: 'Upwork + Fiverr', icon: '+', cls: 'bg-indigo-500/10 text-indigo-400' },
    { value: 'Other', label: 'Other Platform', icon: '•', cls: 'bg-slate-500/10 text-slate-400' },
]
function PlatformSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const selected = PLATFORMS.find(p => p.value === value) ?? PLATFORMS[0]
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border text-sm font-semibold text-slate-200 transition-all
                    ${open
                        ? 'border-indigo-500/50 bg-indigo-500/[0.06] rounded-b-none'
                        : 'border-white/[0.08] bg-white/[0.03] hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]'
                    }`}
            >
                <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center ${selected.cls}`}>
                        {selected.icon}
                    </span>
                    {selected.label}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute left-0 right-0 top-full z-50 bg-[#131c2e] border border-indigo-500/30 border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
                    {PLATFORMS.map(p => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => { onChange(p.value); setOpen(false) }}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all
                                ${p.value === value
                                    ? 'bg-indigo-500/[0.08] text-indigo-300'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                                }`}
                        >
                            <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center ${p.cls}`}>
                                {p.icon}
                            </span>
                            {p.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
export default function AnalyticsForm() {
    const [analyzing, setAnalyzing] = useState(false)
    const [report, setReport] = useState<Report | null>(null)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        platform: 'Upwork',
        totalProjects: '',
        jobSuccessRate: '',
        responseRate: '',
        yearsOfExperience: '',
    })
    useEffect(() => {
        const fetchSavedReport = async () => {
            try {
                const res = await axiosInstance.get('/freelancer/profile')
                const p = res.data?.profile

                if (p) {
                    setForm(f => ({
                        ...f,
                        platform: p.platform || 'Upwork',
                        totalProjects: p.totalProjects ? String(p.totalProjects) : '',
                        jobSuccessRate: p.jobSuccessRate ? String(p.jobSuccessRate) : '',
                        responseRate: p.responseRate ? String(p.responseRate) : '',
                        yearsOfExperience: p.yearsOfExperience ? String(p.yearsOfExperience) : '',
                    }))
                }


                if (p?.aiReport) {
                    setReport(JSON.parse(p.aiReport))
                }
            } catch {
                // no saved data
            }
        }
        fetchSavedReport()
    }, [])
    const handleAnalyze = async () => {
        setAnalyzing(true); setError(''); setReport(null)
        try {
            await axiosInstance.put('/freelancer/profile', {
                platform: form.platform,
                totalProjects: Number(form.totalProjects),
                jobSuccessRate: Number(form.jobSuccessRate),
                responseRate: Number(form.responseRate),
                yearsOfExperience: Number(form.yearsOfExperience),
            })
            const res = await axiosInstance.post('/analyze')
            setReport(res.data.report)
        } catch {
            setError('Analysis failed. Please try again.')
        } finally {
            setAnalyzing(false)
        }
    }
    const scoreColor = !report ? '#6366f1'
        : report.trustScore >= 80 ? '#10b981'
            : report.trustScore >= 60 ? '#818cf8'
                : '#f59e0b'

    const scoreLabel = !report ? ''
        : report.trustScore >= 80 ? 'Exceptional Freelancer'
            : report.trustScore >= 60 ? 'Reliable Freelancer'
                : 'Rising Freelancer'

    // SVG ring math
    const radius = 38, circ = 2 * Math.PI * radius
    const offset = report ? circ - (report.trustScore / 100) * circ : circ

    return (
        <div className="space-y-4">

            {/* ── 2-col layout ── */}
            <div className="grid grid-cols-5 gap-4 items-start">

                {/* Input Card — 3 cols */}
                <div className="col-span-3 bg-[#0f1623] border border-white/[0.07] rounded-3xl overflow-hidden">

                    {/* Platform */}
                    <div className="px-6 pt-6 pb-5 border-b border-white/[0.05]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Platform</p>
                        <PlatformSelect value={form.platform} onChange={v => setForm(f => ({ ...f, platform: v }))} />
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Your Stats</p>
                        <div className="grid grid-cols-2 gap-3">
                            {([
                                { label: 'Total Projects', key: 'totalProjects', ph: '45', suffix: undefined },
                                { label: 'Years Experience', key: 'yearsOfExperience', ph: '3', suffix: undefined },
                                { label: 'Job Success Rate', key: 'jobSuccessRate', ph: '95', suffix: '%' },
                                { label: 'Response Rate', key: 'responseRate', ph: '98', suffix: '%' },
                            ] as const).map(({ label, key, ph, suffix }) => (
                                <div key={key}>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2">{label}</p>
                                    <div className="relative">
                                        <input
                                            type="number" placeholder={ph} min="0"
                                            max={suffix ? '100' : undefined}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 font-mono text-lg font-bold text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.05] focus:ring-2 focus:ring-indigo-500/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={form[key]}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        />
                                        {suffix && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600">
                                                {suffix}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Button */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden group"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #6d28d9)' }} />
                            <span className="relative flex items-center gap-2 text-white tracking-wide">
                                {analyzing
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                                    : <><Sparkles className="w-4 h-4" /> Analyze with AI</>
                                }
                            </span>
                        </button>
                        {error && <p className="mt-3 text-center text-red-400 text-xs font-bold">{error}</p>}
                    </div>
                </div>

                {/* Right Sidebar — 2 cols */}
                <div className="col-span-2 flex flex-col gap-4">

                    {/* How it works */}
                    <div className="bg-[#0f1623] border border-white/[0.07] rounded-3xl p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">How it works</p>
                        <div className="space-y-3">
                            {['Enter your platform stats', 'AI analyzes your profile', 'Get your trust score'].map((s, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Score Tiers */}
                    <div className="bg-[#0f1623] border border-emerald-500/[0.15] rounded-3xl p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 mb-4">Score Tiers</p>
                        <div className="space-y-3">
                            {[
                                { range: '80–100', label: 'Exceptional', color: '#10b981', pct: '85%' },
                                { range: '60–79', label: 'Reliable', color: '#818cf8', pct: '55%' },
                                { range: '0–59', label: 'Rising', color: '#f59e0b', pct: '30%' },
                            ].map(({ range, label, color, pct }) => (
                                <div key={range}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[10px] font-mono text-slate-500">{range}</span>
                                        <span className="text-[9px] font-black tracking-widest uppercase" style={{ color }}>{label}</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: pct, background: color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── AI Report ── */}
            {report && (
                <div className="space-y-4">

                    {/* Score Banner */}
                    <div className="relative overflow-hidden rounded-3xl p-6 flex items-center gap-6 bg-[#0f1623]"
                        style={{ border: `1px solid ${scoreColor}25` }}>
                        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl opacity-15"
                            style={{ background: scoreColor }} />

                        {/* SVG Ring */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <circle cx="48" cy="48" r={radius} fill="none" stroke={scoreColor} strokeWidth="6"
                                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-mono font-bold text-xl leading-none" style={{ color: scoreColor }}>
                                    {report.trustScore}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold mt-0.5">/ 100</span>
                            </div>
                        </div>

                        <div className="relative">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">AI Trust Report</p>
                            <p className="text-xl font-black text-slate-100 tracking-tight">{scoreLabel}</p>
                            <p className="text-xs text-slate-500 mt-1">Analyzed just now</p>
                            <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                                style={{ background: `${scoreColor}12`, borderColor: `${scoreColor}30`, color: scoreColor }}>
                                ✦ Top Performer
                            </span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#0f1623] border border-white/[0.07] rounded-3xl px-6 py-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Summary</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{report.summary}</p>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0f1623] border border-emerald-500/[0.18] rounded-3xl px-5 py-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Strengths</p>
                            </div>
                            {report.strengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0 last:pb-0">
                                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-xs text-slate-400 leading-relaxed">{s}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#0f1623] border border-amber-500/[0.18] rounded-3xl px-5 py-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">Areas to Improve</p>
                            </div>
                            {report.weaknesses.map((w, i) => (
                                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0 last:pb-0">
                                    <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-xs text-slate-400 leading-relaxed">{w}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-gradient-to-br from-indigo-500/[0.06] to-violet-500/[0.04] border border-indigo-500/[0.18] rounded-3xl px-6 py-5 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">Recommendation for Clients</p>
                            <p className="text-sm text-slate-400 leading-relaxed">{report.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}