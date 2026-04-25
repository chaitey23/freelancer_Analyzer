'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { ArrowLeft, Star, CheckCircle } from 'lucide-react'

interface Freelancer {
    _id: string
    bio: string
    trustScore: number
    userId: { name: string }
}

export default function ReviewPage() {
    const { user } = useAuth('client')
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [freelancer, setFreelancer] = useState<Freelancer | null>(null)
    const [rating, setRating] = useState(0)
    const [hovered, setHovered] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axiosInstance.get(`/freelancers/${id}`)
                setFreelancer(res.data.freelancer)

                // আগে review দিয়েছে কিনা check
                const check = await axiosInstance.get(`/reviews/${id}/mine`)
                if (!check.data.canReview) {
                    router.push('/dashboard/client')
                }
            } catch {
                router.push('/dashboard/client')
            }
        }
        if (user && id) fetch()
    }, [user, id])

    const handleSubmit = async () => {
        if (!rating) return setError('Please select a rating')
        if (!comment.trim()) return setError('Please write a comment')
        if (comment.trim().split(/\s+/).filter(Boolean).length < 3)
            return setError('Comment must be at least 3 words')
        setLoading(true); setError('')
        try {
            await axiosInstance.post('/reviews', {
                freelancerId: id,
                rating,
                comment,
            })
            setSuccess(true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to submit review')
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
            <h2 className="text-2xl font-black text-white">Review Submitted!</h2>
            <p className="text-slate-400 text-sm text-center">
                Your review for <span className="text-white font-semibold">{freelancer.userId.name}</span> has been submitted.
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
            <div className="max-w-xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 mb-10 text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-indigo-500 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Leave a Review</p>
                    <h1 className="text-3xl font-black text-white">
                        Rate{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            {freelancer.userId.name}
                        </span>
                    </h1>
                </div>

                <div className="bg-[#0f1623] border border-white/[0.07] rounded-2xl p-6 space-y-6">

                    {/* Star Rating */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">Rating</p>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className="w-9 h-9 transition-colors"
                                        fill={(hovered || rating) >= star ? '#f59e0b' : 'transparent'}
                                        stroke={(hovered || rating) >= star ? '#f59e0b' : '#475569'}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-sm font-bold text-amber-400">
                                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Comment</p>
                        <textarea
                            rows={5}
                            placeholder="Share your experience working with this freelancer..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                        />
                        <p className="text-[10px] text-slate-600 mt-1.5 text-right">
                            {comment.trim().split(/\s+/).filter(Boolean).length} words
                        </p>
                    </div>

                    {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !rating || !comment.trim()}
                        className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                    >
                        {loading
                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><Star className="w-4 h-4" /> Submit Review</>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}