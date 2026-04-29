'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
    {
        value: 12400,
        suffix: '+',
        label: 'Freelancers Analyzed',
        description: 'Across 50+ platforms',
        color: 'from-indigo-500 to-violet-500',
        glowColor: 'rgba(99,102,241,0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        value: 98,
        suffix: '%',
        label: 'Scoring Accuracy',
        description: 'Verified by real hiring data',
        color: 'from-cyan-500 to-blue-500',
        glowColor: 'rgba(6,182,212,0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        value: 3200,
        suffix: '+',
        label: 'Clients Served',
        description: 'From startups to enterprises',
        color: 'from-violet-500 to-purple-500',
        glowColor: 'rgba(139,92,246,0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        value: 4.9,
        suffix: '/5',
        label: 'Platform Rating',
        description: 'Based on 800+ reviews',
        color: 'from-amber-400 to-orange-500',
        glowColor: 'rgba(251,191,36,0.12)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
]

export default function StatsSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)
    const counterRefs = useRef<(HTMLSpanElement | null)[]>([])

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Heading fade + slide up
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: 'top 85%',
                    },
                }
            )

            // Cards stagger slide up
            const cards = cardsRef.current?.querySelectorAll('.stat-card')
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 70, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        stagger: 0.13,
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 80%',
                        },
                    }
                )
            }

            // Counter count-up
            stats.forEach((stat, i) => {
                const el = counterRefs.current[i]
                if (!el) return
                const isDecimal = stat.value % 1 !== 0
                const obj = { val: 0 }

                gsap.to(obj, {
                    val: stat.value,
                    duration: 2.2,
                    ease: 'power2.out',
                    delay: i * 0.13,
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 80%',
                    },
                    onUpdate: () => {
                        if (el) {
                            el.textContent = isDecimal
                                ? obj.val.toFixed(1)
                                : Math.floor(obj.val).toLocaleString()
                        }
                    },
                })
            })

            // Floating glow blobs loop
            const blobs = sectionRef.current?.querySelectorAll('.glow-blob')
            blobs?.forEach((blob, i) => {
                gsap.to(blob, {
                    y: i % 2 === 0 ? -35 : 35,
                    x: i % 2 === 0 ? 18 : -18,
                    duration: 4 + i * 1.2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                })
            })

            // 3D tilt on hover
            const cardEls = cardsRef.current?.querySelectorAll('.stat-card')
            cardEls?.forEach((card) => {
                const el = card as HTMLElement

                el.addEventListener('mousemove', (e: MouseEvent) => {
                    const rect = el.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const cx = rect.width / 2
                    const cy = rect.height / 2

                    gsap.to(el, {
                        rotateX: ((y - cy) / cy) * -7,
                        rotateY: ((x - cx) / cx) * 7,
                        transformPerspective: 800,
                        duration: 0.3,
                        ease: 'power2.out',
                    })

                    const glow = el.querySelector('.card-glow') as HTMLElement
                    if (glow) {
                        gsap.to(glow, {
                            opacity: 1,
                            x: x - cx,
                            y: y - cy,
                            duration: 0.3,
                        })
                    }
                })

                el.addEventListener('mouseleave', () => {
                    gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)',
                    })
                    const glow = el.querySelector('.card-glow') as HTMLElement
                    if (glow) gsap.to(glow, { opacity: 0, duration: 0.3 })
                })
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="relative w-full py-20 overflow-hidden">

            {/* Floating ambient glow blobs */}
            <div className="glow-blob pointer-events-none absolute top-10 left-1/4 w-80 h-80 rounded-full opacity-[0.18]"
                style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(50px)' }} />
            <div className="glow-blob pointer-events-none absolute bottom-10 right-1/4 w-96 h-96 rounded-full opacity-[0.10]"
                style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(70px)' }} />
            <div className="glow-blob pointer-events-none absolute top-1/2 right-12 w-52 h-52 rounded-full opacity-[0.12]"
                style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(35px)' }} />

            {/* Top vertical divider line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Heading */}
                <div ref={headingRef} className="mb-16 text-center opacity-0">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                        Numbers that speak{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            for themselves.
                        </span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-base max-w-md mx-auto leading-relaxed">
                        Real metrics from real clients who found better talent faster.
                    </p>
                </div>

                {/* Cards grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                    style={{ perspective: '1200px' }}
                >
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="stat-card group relative flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm cursor-default opacity-0 overflow-hidden"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Mouse-follow spotlight glow */}
                            <div
                                className="card-glow pointer-events-none absolute w-44 h-44 rounded-full opacity-0"
                                style={{
                                    background: `radial-gradient(circle, ${stat.glowColor} 0%, transparent 70%)`,
                                    transform: 'translate(-50%, -50%)',
                                    top: '50%',
                                    left: '50%',
                                    filter: 'blur(15px)',
                                }}
                            />

                            {/* Top gradient line on hover */}
                            <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Icon + dot */}
                            <div className="flex items-center justify-between">
                                <div
                                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                                    style={{
                                        background: `linear-gradient(135deg, ${stat.glowColor} 0%, rgba(255,255,255,0.04) 100%)`,
                                        border: '1px solid rgba(255,255,255,0.10)',
                                    }}
                                >
                                    {stat.icon}
                                </div>
                                <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${stat.color} opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-lg`} />
                            </div>

                            {/* Counter */}
                            <div>
                                <div className="flex items-baseline gap-0.5">
                                    <span
                                        ref={(el) => { counterRefs.current[i] = el }}
                                        className="text-5xl font-black tracking-tighter"
                                        style={{
                                            background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        0
                                    </span>
                                    <span
                                        className={`text-2xl font-black bg-gradient-to-br ${stat.color}`}
                                        style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                    >
                                        {stat.suffix}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm font-bold text-slate-200 tracking-tight">{stat.label}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{stat.description}</p>
                            </div>

                            {/* Bottom slide-in bar on hover */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden">
                                <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${stat.color} transition-all duration-700 ease-out`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}