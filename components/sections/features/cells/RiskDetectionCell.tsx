import MagCard from '../components/MagCard'
import { riskItems } from '../data/features-data'

export default function RiskDetectionCell() {
    return (
        <MagCard className="bento-cell md:col-span-3 opacity-0 relative rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900/80 p-7 overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h3 className="text-base font-black text-white">Risk Detection</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">Flags suspicious patterns before you hire.</p>
                <div className="flex flex-col gap-2 mt-1">
                    {riskItems.map(item => (
                        <div key={item.label} className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{item.label}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${item.c}`}>{item.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </MagCard>
    )
}