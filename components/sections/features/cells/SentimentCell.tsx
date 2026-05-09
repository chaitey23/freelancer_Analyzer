import MagCard from '../components/MagCard'
import { sentimentReviews, sentimentTags } from '../data/features-data'

export default function SentimentCell() {
    return (
        <MagCard className="bento-cell md:col-span-5 opacity-0 relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/60 to-slate-900/80 p-7 overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4 h-full">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white">Sentiment Analysis</h3>
                        <p className="text-[10px] text-slate-500">NLP-powered review parsing</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    {sentimentReviews.map((r, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2.5 rounded-xl px-3 py-2 text-[11px] leading-snug"
                            style={{
                                background: r.type === 'pos' ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                                border: `1px solid ${r.type === 'pos' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`,
                            }}
                        >
                            <span className="mt-0.5 flex-shrink-0">{r.type === 'pos' ? '↑' : '↓'}</span>
                            <span className={r.type === 'pos' ? 'text-emerald-300/80' : 'text-red-300/80'}>{r.text}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 pt-1">
                    {sentimentTags.map(t => (
                        <span key={t} className="text-[9px] px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300 font-bold uppercase tracking-wider">{t}</span>
                    ))}
                </div>
            </div>
        </MagCard>
    )
}