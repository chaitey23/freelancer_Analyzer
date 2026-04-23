/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, Globe, Mail, Zap } from 'lucide-react'

interface Freelancer {
    _id: string
    avatar: string
    bio: string
    experience: string
    skills: string[]
    portfolio: string
    trustScore: number
    userId: {
        _id: string
        name: string
        email: string
        createdAt: string
    }
}

export default function FreelancerDetails() {
    const { user } = useAuth('client')
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [freelancer, setFreelancer] = useState<Freelancer | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                const res = await axiosInstance.get(`/freelancers/${id}`)
                setFreelancer(res.data.freelancer)
            } catch (error: any) {
                if (error?.response?.status === 404) setNotFound(true)
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (user && id) fetchFreelancer()
    }, [user, id])

    const score = freelancer?.trustScore || 0
    const initials = freelancer?.userId?.name
        ?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    const firstName = freelancer?.userId?.name?.split(' ')[0] || ''
    const memberSince = freelancer?.userId?.createdAt
        ? new Date(freelancer.userId.createdAt).getFullYear()
        : null

    const scoreLabel = score >= 90 ? 'Exceptional' : score >= 70 ? 'Reliable' : 'Rising'
    const scoreAccent = score >= 90 ? '#10b981' : score >= 70 ? '#6366f1' : '#f59e0b'
    const scoreDeg = `${Math.round(score * 3.6)}deg`

    if (!user || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10" />
            </div>
        </div>
    )

    if (notFound || !freelancer) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4">
            <p className="text-6xl font-black text-slate-200 dark:text-white/10">404</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">This expert doesn&apos;t exist.</p>
            <button onClick={() => router.back()}
                className="text-xs text-indigo-500 border border-indigo-500/30 px-4 py-2 rounded-full
                    hover:bg-indigo-500/10 transition-all">
                ← Back
            </button>
        </div>
    )

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-8 lg:px-12 mt-10">
            <div className="max-w-5xl mx-auto">

                {/* ── Back ── */}
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 mb-10 text-xs uppercase tracking-[0.15em]
                        text-slate-400 hover:text-indigo-500 transition-colors duration-200"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Experts
                </button>

                {/* ══════════════════════════════════════
                    HERO — asymmetric split
                ══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 mb-12 items-end">

                    {/* Left: Identity */}
                    <div>
                        {/* Avatar row */}
                        <div className="flex items-center gap-5 mb-6">
                            <div className="relative flex-shrink-0">
                                {freelancer.avatar ? (
                                    <Image
                                        src={freelancer.avatar}
                                        alt={freelancer.userId?.name}
                                        width={72} height={72}
                                        className="w-[72px] h-[72px] rounded-2xl object-cover ring-1 ring-white/10"
                                    />
                                ) : (
                                    <div className="w-[72px] h-[72px] rounded-2xl
                                        bg-gradient-to-br from-indigo-500 to-violet-600
                                        flex items-center justify-center
                                        text-white text-2xl font-black tracking-tight">
                                        {initials}
                                    </div>
                                )}
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5
                                    bg-emerald-400 rounded-full border-2 border-white dark:border-[#0a0b14]" />
                            </div>

                            <div>
                                {memberSince && (
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                                        Member since {memberSince}
                                    </p>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-emerald-500 font-medium">Available now</span>
                                </div>
                            </div>
                        </div>

                        {/* Big name */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight
                            text-slate-900 dark:text-white leading-[1.02] mb-3">
                            {freelancer.userId?.name}
                        </h1>

                        <p className="text-base text-slate-500 dark:text-slate-400 font-light max-w-md leading-relaxed">
                            {freelancer.experience || 'Independent Freelancer'}
                        </p>

                        {/* Contact chips */}
                        <div className="flex flex-wrap gap-2 mt-5">
                            {freelancer.userId?.email && (
                                <span className="inline-flex items-center gap-1.5 text-xs
                                    text-slate-500 dark:text-slate-400
                                    bg-slate-100 dark:bg-white/[0.04]
                                    border border-slate-200 dark:border-white/[0.07]
                                    px-3 py-1.5 rounded-full">
                                    <Mail className="w-3 h-3" />
                                    {freelancer.userId.email}
                                </span>
                            )}
                            {freelancer.portfolio && (
                                <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs
                                        text-indigo-500 dark:text-indigo-400
                                        bg-indigo-50 dark:bg-indigo-500/10
                                        border border-indigo-200 dark:border-indigo-500/20
                                        px-3 py-1.5 rounded-full
                                        hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                    <Globe className="w-3 h-3" />
                                    Portfolio
                                    <ArrowUpRight className="w-2.5 h-2.5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Trust Score ring */}
                    <div className="flex flex-col items-center gap-3 lg:pb-2">
                        <div className="relative w-32 h-32 flex items-center justify-center"
                            style={{
                                background: `conic-gradient(${scoreAccent} 0deg ${scoreDeg}, ${scoreAccent}22 ${scoreDeg} 360deg)`,
                                borderRadius: '50%',
                            }}>
                            <div className="absolute inset-[6px] rounded-full bg-white dark:bg-[#0a0b14]
                                flex flex-col items-center justify-center gap-0.5">
                                <Zap className="w-3.5 h-3.5" style={{ color: scoreAccent }} />
                                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                                    {score}
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Trust Score</p>
                            <p className="text-xs font-semibold mt-0.5" style={{ color: scoreAccent }}>
                                {scoreLabel}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-12" />

                {/* ══════════════════════════════════════
                    BODY — editorial 2-col
                ══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 mb-12">

                    {/* Left: About + Experience */}
                    <div className="space-y-10">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">About</p>
                            <p className="text-base text-slate-600 dark:text-slate-300 leading-[1.85] font-light">
                                {freelancer.bio || "This freelancer hasn't written a bio yet. Reach out to learn more about their work."}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Experience</p>
                            <p className="text-base text-slate-600 dark:text-slate-300 leading-[1.85] font-light">
                                {freelancer.experience || 'No experience details provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Right: Skills */}
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Skills</p>
                        {freelancer.skills?.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                                {freelancer.skills.map((skill, i) => (
                                    <div key={skill}
                                        className="flex items-center justify-between px-4 py-2.5
                                            bg-slate-50 dark:bg-white/[0.03]
                                            border border-slate-100 dark:border-white/[0.06]
                                            rounded-xl
                                            hover:border-indigo-200 dark:hover:border-indigo-500/30
                                            hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.05]
                                            transition-all duration-200 cursor-default">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {skill}
                                        </span>
                                        <span className="text-[10px] text-slate-300 dark:text-white/20 font-mono tabular-nums">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No skills listed.</p>
                        )}
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    CTA — dark full width
                ══════════════════════════════════════ */}
                <div className="relative overflow-hidden rounded-[2rem]
                    bg-slate-900 dark:bg-white/[0.03]
                    border border-slate-800 dark:border-white/[0.08] p-8 sm:p-10">

                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full
                        bg-indigo-600/20 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full
                        bg-violet-600/10 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center
                        justify-between gap-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                                Next step
                            </p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                Work with {firstName}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1.5 font-light">
                                Send a proposal and start collaborating today.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push(`/dashboard/client/hire/${freelancer._id}`)}
                            className="group flex-shrink-0 inline-flex items-center gap-3
                                px-7 py-3.5 rounded-2xl font-bold text-sm
                                bg-indigo-500 hover:bg-indigo-400 text-white
                                active:scale-95 transition-all duration-200"
                        >
                            Send Proposal
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
} 