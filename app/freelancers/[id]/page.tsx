/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, Globe, Mail, Star, Zap } from 'lucide-react'

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

interface Review {
    _id: string
    rating: number
    comment: string
    createdAt: string
    clientId: { name: string }
    reply?: { comment: string; createdAt: string }

}

export default function FreelancerDetails() {
    const { user } = useAuth(['client', 'admin'])
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [freelancer, setFreelancer] = useState<Freelancer | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const [reviews, setReviews] = useState<Review[]>([])
    const [canReview, setCanReview] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [hovered, setHovered] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitMsg, setSubmitMsg] = useState('')

    useEffect(() => {
        const fetchAll = async () => {
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
        if (user && id) fetchAll()
    }, [user, id])

    useEffect(() => {
        if (!id) return
        const fetchReviews = async () => {
            try {
                const [reviewsRes, checkRes] = await Promise.all([
                    axiosInstance.get(`/reviews/${id}`),
                    axiosInstance.get(`/reviews/${id}/mine`)
                ])
                setReviews(reviewsRes.data.reviews || [])
                setCanReview(checkRes.data.canReview || false)
            } catch (err) {
                console.error(err)
            }
        }
        fetchReviews()
    }, [id])

    const handleSubmitReview = async () => {
        if (!comment.trim()) return
        setSubmitting(true)
        setSubmitMsg('')
        try {
            await axiosInstance.post('/reviews', {
                freelancerId: id,
                rating,
                comment
            })
            setSubmitMsg('✓ Review submitted!')
            setCanReview(false)
            setComment('')
            const res = await axiosInstance.get(`/reviews/${id}`)
            setReviews(res.data.reviews || [])
        } catch (err: any) {
            setSubmitMsg(err?.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }
    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (!userData) {
            router.push('/login')
        }
    }, [])

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

    const avgRating = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0

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

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 mb-12 items-end">

                    {/* Left: Identity */}
                    <div>
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

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight
                            text-slate-900 dark:text-white leading-[1.02] mb-3">
                            {freelancer.userId?.name}
                        </h1>

                        <p className="text-base text-slate-500 dark:text-slate-400 font-light max-w-md leading-relaxed">
                            {freelancer.experience || 'Independent Freelancer'}
                        </p>

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

                {/* ── Body ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 mb-12">
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

                {/* ══ REVIEWS SECTION — only show if reviews exist OR client can review ══ */}
                {(reviews.length > 0 || canReview) && (
                    <>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-12" />

                        <div className="mb-12">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Reviews</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                                        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                    </p>
                                </div>
                                {reviews.length > 0 && (
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className="w-4 h-4"
                                                    fill={avgRating >= star ? '#f59e0b' : avgRating >= star - 0.5 ? '#f59e0b' : 'none'}
                                                    stroke={avgRating >= star - 0.5 ? '#f59e0b' : '#e2e8f0'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {avgRating.toFixed(1)} out of 5
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ── Review form ── */}
                            {canReview && (
                                <div className="mb-8 relative overflow-hidden rounded-2xl
                                    bg-gradient-to-br from-indigo-50 to-violet-50/60
                                    dark:from-indigo-500/[0.07] dark:to-violet-500/[0.04]
                                    border border-indigo-100 dark:border-indigo-500/20 p-6">
                                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full
                                        bg-indigo-300/20 blur-2xl pointer-events-none" />

                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-5">
                                        Share your experience
                                    </p>

                                    <div className="flex items-center gap-2 mb-5">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star}
                                                onMouseEnter={() => setHovered(star)}
                                                onMouseLeave={() => setHovered(0)}
                                                onClick={() => setRating(star)}
                                                className="transition-all hover:scale-125 active:scale-95"
                                            >
                                                <Star className="w-7 h-7 transition-colors"
                                                    fill={(hovered || rating) >= star ? '#f59e0b' : 'none'}
                                                    stroke={(hovered || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-1 text-xs font-semibold text-amber-500 w-16">
                                            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][hovered || rating]}
                                        </span>
                                    </div>

                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Describe your experience working with this freelancer..."
                                        rows={3}
                                        className="w-full text-sm text-slate-700 dark:text-slate-200
                                            bg-white dark:bg-white/[0.06]
                                            border border-indigo-100 dark:border-indigo-500/20
                                            rounded-xl px-4 py-3 resize-none outline-none
                                            focus:border-indigo-400 dark:focus:border-indigo-400/60
                                            placeholder:text-slate-300 dark:placeholder:text-slate-500
                                            transition-colors"
                                    />

                                    <div className="flex items-center justify-between mt-4">
                                        {submitMsg ? (
                                            <p className={`text-xs font-medium ${submitMsg.startsWith('✓') ? 'text-emerald-500' : 'text-red-400'}`}>
                                                {submitMsg}
                                            </p>
                                        ) : <span />}
                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={submitting || !comment.trim()}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                                                text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white
                                                disabled:opacity-40 disabled:cursor-not-allowed
                                                active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                    Submitting…
                                                </>
                                            ) : 'Submit Review'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Review list ── */}
                            <div className="space-y-3">
                                {reviews.map((review, i) => (
                                    <div key={review._id}
                                        className="group relative overflow-hidden rounded-2xl
                                            bg-slate-50 dark:bg-white/[0.02]
                                            border border-slate-100 dark:border-white/[0.06]
                                            hover:border-slate-200 dark:hover:border-white/[0.1]
                                            p-5 transition-all duration-200">

                                        {/* watermark number */}
                                        <span className="absolute top-3 right-4 text-5xl font-black
                                            text-slate-100 dark:text-white/[0.03]
                                            select-none pointer-events-none leading-none">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>

                                        <div className="relative flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full
                                                    bg-gradient-to-br from-indigo-400 to-violet-500
                                                    flex items-center justify-center
                                                    text-white text-sm font-black flex-shrink-0">
                                                    {review.clientId?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none mb-1">
                                                        {review.clientId?.name || 'Anonymous'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric', month: 'short', day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className="w-3.5 h-3.5"
                                                        fill={review.rating >= star ? '#f59e0b' : 'none'}
                                                        stroke={review.rating >= star ? '#f59e0b' : '#e2e8f0'}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="relative text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                                            {review.comment}
                                        </p>
                                        {review.reply?.comment && (
                                            <div className="mt-4 ml-12 pl-4 border-l-2 border-indigo-500/30">
                                                <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold mb-1">
                                                    Freelancer&lsquo;s Reply
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {review.reply.comment}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {new Date(review.reply.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ── CTA ── */}
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