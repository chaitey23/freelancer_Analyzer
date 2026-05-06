'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { Clock, CheckCircle, XCircle, Star, ArrowUpRight, Loader2 } from 'lucide-react'

interface Proposal {
    _id: string
    message: string
    status: 'pending' | 'accepted' | 'rejected' | 'completed'
    createdAt: string
    freelancerId: {
        _id: string
        bio: string
        trustScore: number
        skills: string[]
        userId: { name: string; email: string }
    }
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#f59e0b', bg: 'bg-amber-500/10', icon: Clock },
    accepted: { label: 'Accepted', color: '#6366f1', bg: 'bg-indigo-500/10', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#ef4444', bg: 'bg-red-500/10', icon: XCircle },
    completed: { label: 'Completed', color: '#10b981', bg: 'bg-emerald-500/10', icon: CheckCircle },
}

export default function ClientDashboard() {
    const { user } = useAuth('client')
    const router = useRouter()
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)
    const [reviewedIds, setReviewedIds] = useState<string[]>([])

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await axiosInstance.get('/proposals')
                setProposals(res.data.proposals)

                const completed = res.data.proposals.filter((p: Proposal) => p.status === 'completed')
                const reviewed: string[] = []
                await Promise.all(completed.map(async (p: Proposal) => {
                    try {
                        const r = await axiosInstance.get(`/reviews/${p.freelancerId._id}/mine`)
                        if (r.data.review) reviewed.push(p.freelancerId._id)
                    } catch { }
                }))
                setReviewedIds(reviewed)
            } catch {
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchProposals()
    }, [user])

    if (!user || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
    )

    const pending = proposals.filter(p => p.status === 'pending')
    const active = proposals.filter(p => p.status === 'accepted')
    const completed = proposals.filter(p => p.status === 'completed')
    const rejected = proposals.filter(p => p.status === 'rejected')

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-8 mt-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/[0.06]">
                    <div>
                        <p className="text-[17px] uppercase tracking-widest text-slate-500 mb-1">Dashboard</p>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Welcome, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                {user.name?.split(' ')[0]}
                            </span>
                        </h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/client/browse')}
                        className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">Browse Freelancers</span>
                        <span className="sm:hidden">Browse</span>
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Proposals', value: proposals.length, color: '#6366f1' },
                        { label: 'Pending', value: pending.length, color: '#f59e0b' },
                        { label: 'Active', value: active.length, color: '#6366f1' },
                        { label: 'Completed', value: completed.length, color: '#10b981' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-5">
                            <p className="text-2xl font-black text-white mb-1" style={{ color }}>{value}</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Proposals List */}
                <div>
                    <p className="text-[17px] uppercase tracking-widest text-slate-500 mb-5">My Proposals</p>

                    {proposals.length === 0 ? (
                        <div className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-12 text-center">
                            <p className="text-slate-400 text-sm mb-4">No proposals sent yet.</p>
                            <button
                                onClick={() => router.push('dashboard/client/browse')}
                                className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold transition-all"
                            >
                                Find Freelancers
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {proposals.map(proposal => {
                                const cfg = STATUS_CONFIG[proposal.status]
                                const StatusIcon = cfg.icon
                                const isCompleted = proposal.status === 'completed'
                                const alreadyReviewed = reviewedIds.includes(proposal.freelancerId._id)

                                return (
                                    <div key={proposal._id}
                                        className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-all">

                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">
                                                    {proposal.freelancerId?.userId?.name}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>

                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.bg}`}
                                                style={{ color: cfg.color }}>
                                                <StatusIcon className="w-3 h-3" />
                                                {cfg.label}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                                            {proposal.message}
                                        </p>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {proposal.freelancerId?.skills?.slice(0, 4).map(skill => (
                                                <span key={skill}
                                                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-slate-500">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => router.push(`/freelancers/${proposal.freelancerId._id}`)}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                                            >
                                                View Profile →
                                            </button>

                                            {isCompleted && !alreadyReviewed && (
                                                <button
                                                    onClick={() => router.push(`/dashboard/client/review/${proposal.freelancerId._id}`)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all border border-amber-500/20"
                                                >
                                                    <Star className="w-3 h-3" />
                                                    Leave Review
                                                </button>
                                            )}

                                            {isCompleted && alreadyReviewed && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Reviewed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}