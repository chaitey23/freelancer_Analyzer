'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Animated counter ───────────────────────────────────────────────
function useCounter(target: number, duration = 1.6, start = false) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!start) return
        const obj = { val: 0 }
        gsap.to(obj, {
            val: target, duration, ease: 'power2.out',
            onUpdate: () => setValue(Math.round(obj.val)),
        })
    }, [start, target, duration])
    return value
}

// ── Floating particle canvas ───────────────────────────────────────
function ParticleField({ color }: { color: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        const particles = Array.from({ length: 20 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            o: Math.random() * 0.5 + 0.15,
        }))
        let raf: number
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach(p => {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = color.replace(')', `, ${p.o})`).replace('rgb', 'rgba')
                ctx.fill()
                p.x += p.vx; p.y += p.vy
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1
            })
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => cancelAnimationFrame(raf)
    }, [color])
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-2xl" />
}

// ── SVG score ring ─────────────────────────────────────────────────
function ScoreRing({ value, color, started }: { value: number; color: string; started: boolean }) {
    const count = useCounter(value, 1.8, started)
    const r = 36; const circ = 2 * Math.PI * r
    const dash = started ? (count / 100) * circ : 0
    return (
        <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
            <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.05s linear' }} />
            </svg>
            <span className="absolute text-xl font-black text-white">{count}</span>
        </div>
    )
}

// ── Animated bar ───────────────────────────────────────────────────
function Bar({ label, val, color, started }: { label: string; val: number; color: string; started: boolean }) {
    const count = useCounter(val, 1.4, started)
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">{label}</span>
                <span className="font-bold text-slate-200">{count}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: started ? `${val}%` : '0%', background: color, boxShadow: `0 0 8px ${color}55` }} />
            </div>
        </div>
    )
}

// ── Magnetic card ──────────────────────────────────────────────────
function MagCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left, y = e.clientY - rect.top
            const cx = rect.width / 2, cy = rect.height / 2
            gsap.to(el, { rotateX: ((y - cy) / cy) * -7, rotateY: ((x - cx) / cx) * 7, transformPerspective: 1000, duration: 0.4, ease: 'power2.out' })
            if (glowRef.current) gsap.to(glowRef.current, { opacity: 1, left: x, top: y, duration: 0.3 })
        }
        const onLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
            if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
        }
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
    }, [])
    return (
        <div ref={ref} className={className} style={{ ...style, transformStyle: 'preserve-3d' }}>
            <div ref={glowRef} className="pointer-events-none absolute w-40 h-40 rounded-full opacity-0 -translate-x-1/2 -translate-y-1/2 z-0"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(14px)' }} />
            {children}
        </div>
    )
}

// ── Main ───────────────────────────────────────────────────────────
export default function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Heading slide-up
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: headingRef.current, start: 'top 82%' } }
            )

            // Bento cells — each comes from a different direction
            const directions = [
                { x: -50, y: 0 }, { x: 0, y: 50 },
                { x: 0, y: 50 }, { x: 50, y: 0 },
                { x: 0, y: 40 }, { x: 0, y: 60 },
            ]
            gridRef.current?.querySelectorAll('.bento-cell').forEach((cell, i) => {
                const d = directions[i % directions.length]
                gsap.fromTo(cell,
                    { opacity: 0, x: d.x, y: d.y, scale: 0.94 },
                    {
                        opacity: 1, x: 0, y: 0, scale: 1,
                        duration: 0.85, ease: 'power3.out', delay: i * 0.09,
                        scrollTrigger: {
                            trigger: gridRef.current, start: 'top 80%',
                            onEnter: () => { if (i === 0) setStarted(true) }
                        }
                    }
                )
            })

            // Floating ambient blobs
            sectionRef.current?.querySelectorAll('.feat-blob').forEach((b, i) => {
                gsap.to(b, { y: i % 2 === 0 ? -35 : 35, x: i % 2 === 0 ? 18 : -18, duration: 5 + i * 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            })

            // Scan line loop on hero card
            gsap.to('.scan-line', { y: '28rem', duration: 2.8, ease: 'none', repeat: -1, delay: 0.8 })

        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="relative w-full py-24 overflow-hidden bg-slate-950">

            {/* Ambient blobs */}
            <div className="feat-blob pointer-events-none absolute -top-16 left-1/4 w-96 h-96 rounded-full opacity-[0.08]"
                style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', filter: 'blur(70px)' }} />
            <div className="feat-blob pointer-events-none absolute bottom-10 right-1/4 w-80 h-80 rounded-full opacity-[0.09]"
                style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(65px)' }} />
            <div className="feat-blob pointer-events-none absolute top-1/2 left-8 w-60 h-60 rounded-full opacity-[0.06]"
                style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', filter: 'blur(55px)' }} />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Heading */}
                <div ref={headingRef} className="mb-16 text-center opacity-0">
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        What We Offer
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
                        Built for{' '}
                        <span className="relative inline-block">
                            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                precision.
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                                <path d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3" stroke="url(#sq)" strokeWidth="2" fill="none" />
                                <defs>
                                    <linearGradient id="sq" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#6366f1" /><stop offset="0.5" stopColor="#8b5cf6" /><stop offset="1" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h2>
                    <p className="mt-6 text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                        Six powerful tools — one platform. Know exactly who you&apos;re hiring before the contract is signed.
                    </p>
                </div>

                {/* Bento Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-4" style={{ perspective: '1400px' }}>

                    {/* CELL 1 — Reputation Score (large, col 1–7) */}
                    <MagCard className="bento-cell md:col-span-7 opacity-0 relative rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900/80 p-8 overflow-hidden min-h-[280px]">
                        <ParticleField color="rgb(99,102,241)" />
                        <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" style={{ top: 0 }} />
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
                                <ScoreRing value={96} color="#6366f1" started={started} />
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-auto">
                                {[{ label: 'Accuracy', val: '99.2%' }, { label: 'Data Points', val: '40K+' }, { label: 'Avg. Speed', val: '2.8s' }].map(s => (
                                    <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2.5 text-center">
                                        <p className="text-base font-black text-white">{s.val}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MagCard>

                    {/* CELL 2 — Sentiment (col 8–12) */}
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
                                {[
                                    { text: '"Delivered 3 days early, flawless work."', type: 'pos' },
                                    { text: '"Missed 2 deadlines in a row."', type: 'neg' },
                                    { text: '"Best React dev I\'ve ever hired."', type: 'pos' },
                                    { text: '"Communication was really poor."', type: 'neg' },
                                ].map((r, i) => (
                                    <div key={i} className="flex items-start gap-2.5 rounded-xl px-3 py-2 text-[11px] leading-snug"
                                        style={{ background: r.type === 'pos' ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${r.type === 'pos' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}` }}>
                                        <span className="mt-0.5 flex-shrink-0">{r.type === 'pos' ? '↑' : '↓'}</span>
                                        <span className={r.type === 'pos' ? 'text-emerald-300/80' : 'text-red-300/80'}>{r.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                                {['NLP', 'Real-time', 'Auto-flag'].map(t => (
                                    <span key={t} className="text-[9px] px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300 font-bold uppercase tracking-wider">{t}</span>
                                ))}
                            </div>
                        </div>
                    </MagCard>

                    {/* CELL 3 — Analytics bars (col 1–5) */}
                    <MagCard className="bento-cell md:col-span-5 opacity-0 relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/50 to-slate-900/80 p-7 overflow-hidden">
                        <div className="relative z-10 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">Performance Analytics</h3>
                                    <p className="text-[10px] text-slate-500">Live metric dashboard</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                <Bar label="On-time Delivery" val={98} color="#06b6d4" started={started} />
                                <Bar label="Client Satisfaction" val={94} color="#3b82f6" started={started} />
                                <Bar label="Repeat Hire Rate" val={81} color="#6366f1" started={started} />
                                <Bar label="Response Speed" val={89} color="#8b5cf6" started={started} />
                            </div>
                        </div>
                    </MagCard>

                    {/* CELL 4 — Comparison table (col 6–9) */}
                    <MagCard className="bento-cell md:col-span-4 opacity-0 relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900/80 p-7 overflow-hidden">
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 3h5v5" /><path d="M4 20L21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" />
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
                                {[
                                    { name: 'john_dev', score: 96, rate: '$85', top: true },
                                    { name: 'sara_ux', score: 88, rate: '$70', top: false },
                                    { name: 'mk_code', score: 74, rate: '$55', top: false },
                                ].map((f, i) => (
                                    <div key={f.name} className={`grid grid-cols-3 px-3 py-2 text-[11px] ${i < 2 ? 'border-b border-white/[0.04]' : ''} ${f.top ? 'bg-amber-500/[0.06]' : ''}`}>
                                        <span className={`font-mono truncate ${f.top ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>@{f.name}</span>
                                        <span className={f.top ? 'text-amber-300 font-black' : 'text-slate-400'}>{f.score}</span>
                                        <span className={f.top ? 'text-amber-300' : 'text-slate-500'}>{f.rate}/h</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-500">Compare up to 5 candidates across any metric instantly.</p>
                        </div>
                    </MagCard>

                    {/* CELL 5 — Risk Detection (col 10–12) */}
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
                                {[
                                    { label: 'Fake Reviews', status: 'Flagged', c: 'text-red-400 bg-red-500/10 border-red-500/20' },
                                    { label: 'Rating Drop', status: 'Warning', c: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                                    { label: 'Identity', status: 'Verified', c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400">{item.label}</span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${item.c}`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MagCard>

                    {/* CELL 6 — Multi-platform full-width */}
                    <MagCard className="bento-cell md:col-span-12 opacity-0 relative rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-950/30 to-slate-900/80 p-8 overflow-hidden">
                        <ParticleField color="rgb(236,72,153)" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="flex-shrink-0 max-w-[260px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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
                                {[
                                    { name: 'Upwork', score: 4.9, jobs: 142, color: '#14a800', glow: 'rgba(20,168,0,0.12)' },
                                    { name: 'Fiverr', score: 4.8, jobs: 88, color: '#1dbf73', glow: 'rgba(29,191,115,0.12)' },
                                    { name: 'Toptal', score: 4.7, jobs: 23, color: '#f26822', glow: 'rgba(242,104,34,0.12)' },
                                ].map(p => (
                                    <div key={p.name} className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-4 flex flex-col gap-2"
                                        style={{ boxShadow: `inset 0 0 30px ${p.glow}` }}>
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

                </div>
            </div>
        </section>
    )
}