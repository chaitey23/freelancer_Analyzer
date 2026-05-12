'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const tabs = {
    client: {
        label: 'For Clients',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        steps: [
            {
                number: '01',
                title: 'Search a Freelancer',
                description: 'Enter any freelancer\'s name or username from Upwork, Fiverr, or Toptal. Our engine instantly pulls their public profile data.',
                color: 'from-indigo-500 to-violet-500',
                glowColor: 'rgba(99,102,241,0.2)',
                borderColor: 'rgba(99,102,241,0.25)',
                icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                ),
                visual: (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span className="text-sm text-slate-300 font-mono">@john_dev_pro</span>
                            <span className="ml-auto text-[10px] text-indigo-400 animate-pulse">Searching...</span>
                        </div>
                        <div className="flex gap-2">
                            {['Upwork', 'Fiverr', 'Toptal'].map((p) => (
                                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-400">{p}</span>
                            ))}
                        </div>
                    </div>
                ),
            },
            {
                number: '02',
                title: 'AI Analyzes Everything',
                description: 'Our model scans reviews, completion rates, response time, and dispute history — then generates a verified reputation score in seconds.',
                color: 'from-cyan-500 to-blue-500',
                glowColor: 'rgba(6,182,212,0.2)',
                borderColor: 'rgba(6,182,212,0.25)',
                icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                ),
                visual: (
                    <div className="flex flex-col gap-2.5">
                        {[
                            { label: 'Review Sentiment', val: 94, color: '#06b6d4' },
                            { label: 'Completion Rate', val: 98, color: '#3b82f6' },
                            { label: 'Response Time', val: 87, color: '#6366f1' }
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-slate-400">{item.label}</span>
                                    <span className="text-slate-300 font-bold">{item.val}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color, opacity: 0.8 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ),
            },
            {
                number: '03',
                title: 'Hire with Confidence',
                description: 'Receive a detailed reputation breakdown with a final trust score. Compare candidates side-by-side and hire with complete confidence.',
                color: 'from-violet-500 to-purple-600',
                glowColor: 'rgba(139,92,246,0.2)',
                borderColor: 'rgba(139,92,246,0.25)',
                icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ),
                visual: (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Trust Score</p>
                                <p className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>96<span className="text-lg">/100</span></p>
                            </div>
                            <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-violet-500/40 bg-violet-500/10">
                                <span className="text-xs font-black text-violet-300">A+</span>
                            </div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {['Top 4%', 'Verified', 'Fast Delivery'].map((tag) => (
                                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300 font-bold">{tag}</span>
                            ))}
                        </div>
                    </div>
                ),
            },
        ],
    },
    freelancer: {
        label: 'For Freelancers',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
        steps: [
            {
                number: '01',
                title: 'Create Your Profile',
                description: 'Register and link your freelancing accounts. We verify your identity and pull your work history from supported platforms automatically.',
                color: 'from-sky-400 to-cyan-500',
                glowColor: 'rgba(56,189,248,0.18)',
                borderColor: 'rgba(56,189,248,0.22)',
                icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                ),
                visual: (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white text-sm font-black">JD</div>
                            <div>
                                <p className="text-sm font-bold text-slate-200">John Dev</p>
                                <p className="text-[10px] text-sky-400">● Profile linked</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {['Upwork ✓', 'Fiverr ✓'].map((p) => (
                                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400">{p}</span>
                            ))}
                        </div>
                    </div>
                ),
            },
            {
                number: '02',
                title: 'Get Scored by AI',
                description: 'Our AI evaluates your entire freelancing history — ratings, review quality, on-time delivery, and client satisfaction — to generate your reputation score.',
                color: 'from-violet-400 to-purple-500',
                glowColor: 'rgba(167,139,250,0.18)',
                borderColor: 'rgba(167,139,250,0.22)',
                icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ),
                visual: (
                    <div className="flex flex-col gap-2.5">
                        {[
                            { label: 'On-time Delivery', val: 96, color: '#a78bfa' },
                            { label: 'Client Satisfaction', val: 91, color: '#8b5cf6' },
                            { label: 'Repeat Hire Rate', val: 78, color: '#7c3aed' }
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-slate-400">{item.label}</span>
                                    <span className="text-slate-300 font-bold">{item.val}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color, opacity: 0.8 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ),
            },
            {
                number: '03',
                title: 'Improve & Stand Out',
                description: 'Use your analytics dashboard to see exactly where to improve. A higher score means more visibility and more clients choosing you over the competition.',
                color: 'from-fuchsia-400 to-pink-500',
                glowColor: 'rgba(232,121,249,0.18)',
                borderColor: 'rgba(232,121,249,0.22)',
                icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                    </svg>
                ),
                visual: (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Your Score</p>
                                <p className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #e879f9, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>82<span className="text-lg">/100</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500">vs last month</p>
                                <p className="text-sm font-black text-fuchsia-400">↑ +12pts</p>
                            </div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {['Top 18%', 'Rising Talent'].map((tag) => (
                                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/20 text-fuchsia-300 font-bold">{tag}</span>
                            ))}
                        </div>
                    </div>
                ),
            },
        ],
    },
}

type TabKey = keyof typeof tabs

export default function HowItWorksSection() {
    const [activeTab, setActiveTab] = useState<TabKey>('client')
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const tabsRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const lineRef = useRef<HTMLDivElement>(null)
    const rafRef = useRef<number>(0) // ✅ RAF throttle

    // Tab change → cards animate in
    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean)
        if (!cards.length) return

        gsap.fromTo(cards,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
        )

        if (lineRef.current) {
            gsap.fromTo(lineRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 0.9, ease: 'power2.inOut', delay: 0.1 }
            )
        }
    }, [activeTab])

    // Scroll entrance — ✅ blob loop সরানো হয়েছে
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
            )
            gsap.fromTo(tabsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2, scrollTrigger: { trigger: tabsRef.current, start: 'top 88%' } }
            )
            // ❌ blob gsap loop এখানে ছিল — সরানো হয়েছে, CSS করছে
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    // ✅ Hover tilt — RAF throttle সহ
    const initTilt = (el: HTMLDivElement | null) => {
        if (!el) return

        el.addEventListener('mousemove', (e: MouseEvent) => {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const cx = rect.width / 2
                const cy = rect.height / 2

                gsap.to(el, {
                    rotateX: ((y - cy) / cy) * -6,
                    rotateY: ((x - cx) / cx) * 6,
                    transformPerspective: 900,
                    duration: 0.3,
                    ease: 'power2.out',
                })

                const glow = el.querySelector('.card-glow') as HTMLElement
                if (glow) gsap.to(glow, { opacity: 1, x: x - cx, y: y - cy, duration: 0.3 })
            })
        })

        el.addEventListener('mouseleave', () => {
            cancelAnimationFrame(rafRef.current)
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
            const glow = el.querySelector('.card-glow') as HTMLElement
            if (glow) gsap.to(glow, { opacity: 0, duration: 0.3 })
        })
    }

    const currentSteps = tabs[activeTab].steps

    const lineGradient = activeTab === 'client'
        ? 'linear-gradient(90deg, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.6) 50%, rgba(6,182,212,0.4) 100%)'
        : 'linear-gradient(90deg, rgba(56,189,248,0.6) 0%, rgba(167,139,250,0.6) 50%, rgba(232,121,249,0.4) 100%)'

    return (
        <section ref={sectionRef} className="relative w-full py-20 overflow-hidden">

            {/* ✅ Blob — এখন CSS animate করছে (globals.css) */}
            <div className="blob-a pointer-events-none absolute top-20 right-1/4 w-72 h-72 rounded-full opacity-[0.12]"
                style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(50px)' }} />
            <div className="blob-b pointer-events-none absolute bottom-20 left-1/4 w-80 h-80 rounded-full opacity-[0.08]"
                style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(60px)' }} />

            {/* Top divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Heading */}
                <div ref={headingRef} className="mb-10 text-center opacity-0">
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Simple 3-step process
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                        How it{' '}
                        <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            works.
                        </span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-base max-w-md mx-auto leading-relaxed">
                        From search to hire in under 60 seconds. No guesswork, no surprises.
                    </p>
                </div>

                {/* Tab switcher */}
                <div ref={tabsRef} className="flex justify-center mb-14 opacity-0">
                    <div className="inline-flex items-center gap-1 p-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                        {(Object.keys(tabs) as TabKey[]).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === key
                                    ? 'bg-white/10 text-white shadow-lg border border-white/15'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {tabs[key].icon}
                                {tabs[key].label}
                                {activeTab === key && (
                                    <span className={`w-1.5 h-1.5 rounded-full ${key === 'client' ? 'bg-indigo-400' : 'bg-sky-400'} animate-pulse`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards */}
                <div className="relative">

                    {/* Connector line */}
                    <div className="hidden lg:block absolute top-[3.6rem] left-[16.5%] right-[16.5%] h-px z-0">
                        <div ref={lineRef} className="h-full" style={{ background: lineGradient }} />
                        {[0, 50, 100].map((pos) => (
                            <div key={pos} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30"
                                style={{ left: `${pos}%` }} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
                        {currentSteps.map((step, i) => (
                            <div
                                key={`${activeTab}-${step.number}`}
                                ref={(el) => { cardsRef.current[i] = el; initTilt(el) }}
                                className="group relative flex flex-col gap-6 rounded-2xl border bg-white/[0.03] p-7 backdrop-blur-sm cursor-default opacity-0 overflow-hidden"
                                style={{ borderColor: step.borderColor, transformStyle: 'preserve-3d' }}
                            >
                                {/* Spotlight */}
                                <div className="card-glow pointer-events-none absolute w-48 h-48 rounded-full opacity-0"
                                    style={{ background: `radial-gradient(circle, ${step.glowColor} 0%, transparent 70%)`, transform: 'translate(-50%, -50%)', top: '50%', left: '50%', filter: 'blur(15px)' }} />

                                {/* Top line */}
                                <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${step.color}`} />

                                {/* Icon + number */}
                                <div className="flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                                        style={{ background: `linear-gradient(135deg, ${step.glowColor}, rgba(255,255,255,0.03))`, border: `1px solid ${step.borderColor}` }}>
                                        {step.icon}
                                    </div>
                                    <span className={`text-5xl font-black tracking-tighter bg-gradient-to-br ${step.color}`}
                                        style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {step.number}
                                    </span>
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-lg font-black tracking-tight text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                                </div>

                                {/* Visual */}
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                                    {step.visual}
                                </div>

                                {/* Bottom hover bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden">
                                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${step.color} transition-all duration-700 ease-out`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}