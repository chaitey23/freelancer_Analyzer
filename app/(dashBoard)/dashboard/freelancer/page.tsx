'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import {
    Clock, CheckCircle, XCircle, Star,
    ArrowUpRight, ChevronDown, ChevronUp,
    Briefcase, TrendingUp, AlertCircle
} from 'lucide-react'

interface Proposal {
    _id: string
    message: string
    status: 'pending' | 'accepted' | 'rejected' | 'completed'
    createdAt: string
    clientId: {
        _id: string
        name: string
        email: string
    }
}

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        color: '#f59e0b',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: Clock,
    },
    accepted: {
        label: 'Accepted',
        color: '#6366f1',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        color: '#ef4444',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: XCircle,
    },
    completed: {
        label: 'Completed',
        color: '#10b981',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        icon: CheckCircle,
    },
}

export default function FreelancerDashboard() {
    const { user } = useAuth('freelancer')
    const router = useRouter()
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await axiosInstance.get('/proposals/freelancer')
                setProposals(res.data.proposals)
            } catch {
                setError('Failed to load proposals')
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchProposals()
    }, [user])

    const handleAction = async (proposalId: string, action: 'accept' | 'reject' | 'complete') => {
        setActionLoading(`${proposalId}-${action}`)
        setError('')
        try {
            await axiosInstance.put(`/proposals/${proposalId}`, { action })
            setProposals(prev =>
                prev.map(p =>
                    p._id === proposalId
                        ? {
                            ...p,
                            status:
                                action === 'accept'
                                    ? 'accepted'
                                    : action === 'reject'
                                        ? 'rejected'
                                        : 'completed',
                        }
                        : p
                )
            )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err?.response?.data?.message || `Failed to ${action} proposal`)
        } finally {
            setActionLoading(null)
        }
    }

    if (!user || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
    )

    const pending = proposals.filter(p => p.status === 'pending')
    const accepted = proposals.filter(p => p.status === 'accepted')
    const completed = proposals.filter(p => p.status === 'completed')
    const rejected = proposals.filter(p => p.status === 'rejected')

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-8 mt-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/[0.06]">
                    <div>
                        <p className="text-[17px] uppercase tracking-widest text-slate-500 mb-1">Freelancer</p>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Welcome,{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                {user.name?.split(' ')[0]}
                            </span>
                        </h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/freelancer/profile')}
                        className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                    >
                        <span className="hidden sm:inline">My Profile</span>
                        <span className="sm:hidden">Profile</span>
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total', value: proposals.length, color: '#6366f1', icon: Briefcase },
                        { label: 'Pending', value: pending.length, color: '#f59e0b', icon: Clock },
                        { label: 'Active', value: accepted.length, color: '#6366f1', icon: TrendingUp },
                        { label: 'Completed', value: completed.length, color: '#10b981', icon: Star },
                    ].map(({ label, value, color, icon: Icon }) => (
                        <div key={label} className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                                <Icon className="w-4 h-4 text-slate-600" />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Proposals */}
                <div>
                    <p className="text-[17px] uppercase tracking-widest text-slate-500 mb-5">Incoming Proposals</p>

                    {proposals.length === 0 ? (
                        <div className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-12 text-center">
                            <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">No proposals yet. Complete your profile to get noticed!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {proposals.map(proposal => {
                                const cfg = STATUS_CONFIG[proposal.status]
                                const StatusIcon = cfg.icon
                                const isExpanded = expanded === proposal._id

                                return (
                                    <div
                                        key={proposal._id}
                                        className="bg-[#0f1623] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all"
                                    >
                                        {/* Card Header */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <p className="text-sm font-bold text-white mb-0.5">
                                                        {proposal.clientId?.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        {proposal.clientId?.email}
                                                    </p>
                                                    <p className="text-[10px] text-slate-600 mt-0.5">
                                                        {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric', month: 'short', day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.bg} border ${cfg.border}`}
                                                    style={{ color: cfg.color }}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {cfg.label}
                                                </span>
                                            </div>

                                            {/* Message Preview */}
                                            <p className={`text-xs text-slate-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                {proposal.message}
                                            </p>

                                            {proposal.message.length > 120 && (
                                                <button
                                                    onClick={() => setExpanded(isExpanded ? null : proposal._id)}
                                                    className="mt-1.5 flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <><ChevronUp className="w-3 h-3" /> Show less</>
                                                    ) : (
                                                        <><ChevronDown className="w-3 h-3" /> Read more</>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {(proposal.status === 'pending' || proposal.status === 'accepted') && (
                                            <div className="px-5 pb-5 flex items-center gap-3">

                                                {/* Pending → Accept / Reject */}
                                                {proposal.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(proposal._id, 'accept')}
                                                            disabled={!!actionLoading}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === `${proposal._id}-accept` ? (
                                                                <span className="w-3 h-3 border border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            )}
                                                            Accept
                                                        </button>

                                                        <button
                                                            onClick={() => handleAction(proposal._id, 'reject')}
                                                            disabled={!!actionLoading}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {actionLoading === `${proposal._id}-reject` ? (
                                                                <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                            ) : (
                                                                <XCircle className="w-3.5 h-3.5" />
                                                            )}
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {/* Accepted → Complete */}
                                                {proposal.status === 'accepted' && (
                                                    <button
                                                        onClick={() => handleAction(proposal._id, 'complete')}
                                                        disabled={!!actionLoading}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === `${proposal._id}-complete` ? (
                                                            <span className="w-3 h-3 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                                                        ) : (
                                                            <Star className="w-3.5 h-3.5" />
                                                        )}
                                                        Mark as Complete
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Completed / Rejected state */}
                                        {proposal.status === 'completed' && (
                                            <div className="px-5 pb-5">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Job Completed
                                                </span>
                                            </div>
                                        )}

                                        {proposal.status === 'rejected' && (
                                            <div className="px-5 pb-5">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-red-500/70 font-semibold">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Proposal Rejected
                                                </span>
                                            </div>
                                        )}
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