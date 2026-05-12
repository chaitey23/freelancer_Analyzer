import MagCard from '../components/MagCard'
import Bar from '../components/Bar'
import { analyticsMetrics } from '../data/features-data'

export default function AnalyticsCell() {
    return (
        <MagCard className="bento-cell md:col-span-5 relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/50 to-slate-900/80 p-7 overflow-hidden">
            <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white">Performance Analytics</h3>
                        <p className="text-[10px] text-slate-500">Live metric dashboard</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3.5">
                    {analyticsMetrics.map(m => (
                        <Bar key={m.label} label={m.label} val={m.val} color={m.color} />
                    ))}
                </div>
            </div>
        </MagCard>
    )
}