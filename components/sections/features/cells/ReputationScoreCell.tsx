import ScoreRing from '../components/ScoreRing'
import MagCard from '../components/MagCard'
import { reputationStats } from '../data/features-data'

export default function ReputationScoreCell() {
    return (
        <MagCard className="bento-cell md:col-span-7 relative rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900/80 p-8 overflow-hidden min-h-[280px]">
            <div className="relative z-10 flex flex-col h-full gap-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Core AI Engine</span>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Reputation Scoring</h3>
                        <p className="mt-2 text-slate-400 text-sm leading-relaxed max-w-xs">
                            Analyzes thousands of data points — reviews, dispute history, completion rates — and produces a single verified trust score in under 3 seconds.
                        </p>
                    </div>
                    <ScoreRing value={96} color="#6366f1" />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-auto">
                    {reputationStats.map(s => (
                        <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2.5 text-center">
                            <p className="text-base font-black text-white">{s.val}</p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </MagCard>
    )
}