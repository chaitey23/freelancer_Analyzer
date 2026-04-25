'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'

interface Freelancer {
    _id: string
    bio: string
    skills: string[]
    trustScore: number
    userId: { name: string; email: string }
}

export default function HirePage() {
    const { user } = useAuth('client')
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [freelancer, setFreelancer] = useState<Freelancer | null>(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axiosInstance.get(`/freelancers/${id}`)
                setFreelancer(res.data.freelancer)
            } catch {
                router.push('/dashboard/client')
            }
        }
        if (user && id) fetch()
    }, [user, id])

    const handleSubmit = async () => {
        if (!message.trim()) return setError('Please write a message')
        setLoading(true); setError('')
        try {
            await axiosInstance.post('/proposals', {
                freelancerId: id,
                message,
            })
            setSuccess(true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to send proposal')
        } finally {
            setLoading(false)
        }
    }

    if (!user || !freelancer) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
    )

    if (success) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-white">Proposal Sent!</h2>
            <p className="text-slate-400 text-sm text-center">
                Your proposal has been sent to <span className="text-white font-semibold">{freelancer.userId.name}</span>.
                <br />You&apos;ll be notified when they respond.
            </p>
            <button
                onClick={() => router.push('/dashboard/client')}
                className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold transition-all"
            >
                Back to Dashboard
            </button>
        </div>
    )

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-8 mt-10">
            <div className="max-w-2xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 mb-10 text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Send Proposal</p>
                    <h1 className="text-3xl font-black text-white">
                        Work with{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            {freelancer.userId.name}
                        </span>
                    </h1>
                </div>

                {/* Freelancer Summary */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-slate-200">{freelancer.userId.name}</p>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold">
                            Trust Score: {freelancer.trustScore}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{freelancer.bio || 'No bio available.'}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {freelancer.skills?.slice(0, 5).map(skill => (
                            <span key={skill} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-400">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Proposal Form */}
                <div className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-6 space-y-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Your Message</p>
                        <textarea
                            rows={6}
                            placeholder="Describe your project, requirements, timeline, and budget..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                        />
                        <p className="text-[10px] text-slate-600 mt-1.5 text-right">{message.length} characters</p>
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs font-semibold">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !message.trim()}
                        className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                    >
                        {loading
                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><Send className="w-4 h-4" /> Send Proposal</>
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}