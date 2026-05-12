// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// import ReputationScoreCell from './cells/ReputationScoreCell'
// import SentimentCell from './cells/SentimentCell'
// import AnalyticsCell from './cells/AnalyticsCell'
// import ComparisonCell from './cells/ComparisonCell'
// import RiskDetectionCell from './cells/RiskDetectionCell'
// import MultiPlatformCell from './cells/MultiPlatformCell'

// gsap.registerPlugin(ScrollTrigger)

// export default function FeaturesSection() {
//     const sectionRef = useRef<HTMLDivElement>(null)
//     const headingRef = useRef<HTMLDivElement>(null)
//     const gridRef = useRef<HTMLDivElement>(null)
//     const [started, setStarted] = useState(false)

//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             // Heading slide-up
//             gsap.fromTo(
//                 headingRef.current,
//                 { opacity: 0, y: 60 },
//                 {
//                     opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
//                     scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
//                 }
//             )

//             // Bento cells — each comes from a different direction
//             const directions = [
//                 { x: -50, y: 0 }, { x: 0, y: 50 },
//                 { x: 0, y: 50 }, { x: 50, y: 0 },
//                 { x: 0, y: 40 }, { x: 0, y: 60 },
//             ]
//             gridRef.current?.querySelectorAll('.bento-cell').forEach((cell, i) => {
//                 const d = directions[i % directions.length]
//                 gsap.fromTo(
//                     cell,
//                     { opacity: 0, x: d.x, y: d.y, scale: 0.94 },
//                     {
//                         opacity: 1, x: 0, y: 0, scale: 1,
//                         duration: 0.85, ease: 'power3.out', delay: i * 0.09,
//                         scrollTrigger: {
//                             trigger: gridRef.current, start: 'top 80%',
//                             onEnter: () => { if (i === 0) setStarted(true) },
//                         },
//                     }
//                 )
//             })

//             // Floating ambient blobs
//             sectionRef.current?.querySelectorAll('.feat-blob').forEach((b, i) => {
//                 gsap.to(b, {
//                     y: i % 2 === 0 ? -35 : 35, x: i % 2 === 0 ? 18 : -18,
//                     duration: 5 + i * 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
//                 })
//             })

//             // Scan line loop on hero card
//             gsap.to('.scan-line', { y: '28rem', duration: 2.8, ease: 'none', repeat: -1, delay: 0.8 })
//         }, sectionRef)
//         return () => ctx.revert()
//     }, [])

//     return (
//         <section ref={sectionRef} className="relative w-full py-14 overflow-hidden">

//             {/* Ambient blobs */}
//             <div className="feat-blob pointer-events-none absolute -top-16 left-1/4 w-96 h-96 rounded-full opacity-[0.08]"
//                 style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', filter: 'blur(70px)' }} />
//             <div className="feat-blob pointer-events-none absolute bottom-10 right-1/4 w-80 h-80 rounded-full opacity-[0.09]"
//                 style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(65px)' }} />
//             <div className="feat-blob pointer-events-none absolute top-1/2 left-8 w-60 h-60 rounded-full opacity-[0.06]"
//                 style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', filter: 'blur(55px)' }} />

//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />

//             <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

//                 {/* Heading */}
//                 <div ref={headingRef} className="mb-16 text-center opacity-0">
//                     <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-sm">
//                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
//                         What We Offer
//                     </div>
//                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
//                         Built for{' '}
//                         <span className="relative inline-block">
//                             <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                                 precision.
//                             </span>
//                             <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
//                                 <path d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3" stroke="url(#sq)" strokeWidth="2" fill="none" />
//                                 <defs>
//                                     <linearGradient id="sq" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
//                                         <stop stopColor="#6366f1" /><stop offset="0.5" stopColor="#8b5cf6" /><stop offset="1" stopColor="#06b6d4" />
//                                     </linearGradient>
//                                 </defs>
//                             </svg>
//                         </span>
//                     </h2>
//                     <p className="mt-6 text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
//                         Six powerful tools — one platform. Know exactly who you&apos;re hiring before the contract is signed.
//                     </p>
//                 </div>

//                 {/* Bento Grid */}
//                 <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-4" style={{ perspective: '1400px' }}>
//                     <ReputationScoreCell started={started} />
//                     <SentimentCell />
//                     <AnalyticsCell started={started} />
//                     <ComparisonCell />
//                     <RiskDetectionCell />
//                     <MultiPlatformCell />
//                 </div>
//             </div>
//         </section>
//     )
// }
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ReputationScoreCell from './cells/ReputationScoreCell'
import SentimentCell from './cells/SentimentCell'
import AnalyticsCell from './cells/AnalyticsCell'
import ComparisonCell from './cells/ComparisonCell'
import RiskDetectionCell from './cells/RiskDetectionCell'
import MultiPlatformCell from './cells/MultiPlatformCell'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ✅ Heading slide-up — রাখা হয়েছে
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
                }
            )

            // ✅ Bento cells entrance — রাখা হয়েছে
            const directions = [
                { x: -50, y: 0 }, { x: 0, y: 50 },
                { x: 0, y: 50 }, { x: 50, y: 0 },
                { x: 0, y: 40 }, { x: 0, y: 60 },
            ]
            gridRef.current?.querySelectorAll('.bento-cell').forEach((cell, i) => {
                const d = directions[i % directions.length]
                gsap.fromTo(
                    cell,
                    { opacity: 0, x: d.x, y: d.y, scale: 0.94 },
                    {
                        opacity: 1, x: 0, y: 0, scale: 1,
                        duration: 0.85, ease: 'power3.out', delay: i * 0.09,
                        scrollTrigger: {
                            trigger: gridRef.current, start: 'top 80%',
                            onEnter: () => { if (i === 0) setStarted(true) },
                        },
                    }
                )
            })

            // ❌ feat-blob gsap loop — সরানো হয়েছে, CSS করছে
            // ❌ scan-line gsap loop  — সরানো হয়েছে, CSS করছে

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="relative w-full py-14 overflow-hidden">

            {/* ✅ Blob — CSS animate (globals.css) */}
            <div className="blob-a pointer-events-none absolute -top-16 left-1/4 w-96 h-96 rounded-full opacity-[0.08]"
                style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', filter: 'blur(70px)' }} />
            <div className="blob-b pointer-events-none absolute bottom-10 right-1/4 w-80 h-80 rounded-full opacity-[0.09]"
                style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(65px)' }} />
            <div className="blob-c pointer-events-none absolute top-1/2 left-8 w-60 h-60 rounded-full opacity-[0.06]"
                style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', filter: 'blur(55px)' }} />

            {/* Top divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />

            {/* ✅ Scan line — CSS animate (globals.css এ scan-line class) */}
            <div className="scan-line pointer-events-none absolute left-0 right-0 h-px opacity-[0.15] z-0"
                style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)' }} />

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
                                        <stop stopColor="#6366f1" />
                                        <stop offset="0.5" stopColor="#8b5cf6" />
                                        <stop offset="1" stopColor="#06b6d4" />
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
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-4" >
                    <ReputationScoreCell started={started} />
                    <SentimentCell />
                    <AnalyticsCell started={started} />
                    <ComparisonCell />
                    <RiskDetectionCell />
                    <MultiPlatformCell />
                </div>
            </div>
        </section>
    )
}