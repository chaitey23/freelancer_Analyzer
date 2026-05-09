import MagCard from '../components/MagCard'
import { comparisonFreelancers } from '../data/features-data'

export default function ComparisonCell() {
    return (
        <MagCard className="bento-cell md:col-span-4 opacity-0 relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900/80 p-7 overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 3h5v5" /><path d="M4 20L21 3" />
                            <path d="M21 16v5h-5" /><path d="M15 15l6 6" />
                            <path d="M4 4l5 5" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white">Instant Comparison</h3>
                        <p className="text-[10px] text-slate-500">Side-by-side analysis</p>
                    </div>
                </div>
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.03] overflow-hidden">
                    <div className="grid grid-cols-3 px-3 py-1.5 border-b border-white/[0.05]">
                        {['Freelancer', 'Score', 'Rate'].map(h => (
                            <span key={h} className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{h}</span>
                        ))}
                    </div>
                    {comparisonFreelancers.map((f, i) => (
                        <div
                            key={f.name}
                            className={`grid grid-cols-3 px-3 py-2 text-[11px] ${i < 2 ? 'border-b border-white/[0.04]' : ''} ${f.top ? 'bg-amber-500/[0.06]' : ''}`}
                        >
                            <span className={`font-mono truncate ${f.top ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>@{f.name}</span>
                            <span className={f.top ? 'text-amber-300 font-black' : 'text-slate-400'}>{f.score}</span>
                            <span className={f.top ? 'text-amber-300' : 'text-slate-500'}>{f.rate}/h</span>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-slate-500">Compare up to 5 candidates across any metric instantly.</p>
            </div>
        </MagCard>
    )
}