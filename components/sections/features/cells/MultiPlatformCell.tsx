import MagCard from '../components/MagCard'
import ParticleField from '../components/ParticleField'
import { platforms } from '../data/features-data'

export default function MultiPlatformCell() {
    return (
        <MagCard className="bento-cell md:col-span-12 opacity-0 relative rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-950/30 to-slate-900/80 p-8 overflow-hidden">
            <ParticleField color="rgb(236,72,153)" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-shrink-0 max-w-[260px]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                        </div>
                        <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">Multi-platform</span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight">One Profile. Every Platform.</h3>
                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                        We unify reputation data from Upwork, Fiverr, Toptal and more — no manual research needed.
                    </p>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    {platforms.map(p => (
                        <div
                            key={p.name}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-4 flex flex-col gap-2"
                            style={{ boxShadow: `inset 0 0 30px ${p.glow}` }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-white">{p.name}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold">Connected</span>
                            </div>
                            <span className="text-xl font-black" style={{ color: p.color }}>★ {p.score}</span>
                            <p className="text-[10px] text-slate-500">{p.jobs} completed jobs</p>
                        </div>
                    ))}
                </div>
            </div>
        </MagCard>
    )
}