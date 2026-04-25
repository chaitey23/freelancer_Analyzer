/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { ArrowLeft, Star, ArrowUpRight, Zap } from 'lucide-react'

interface FreelancerUser {
    name: string
}

interface FreelancerInfo {
    _id: string
    avatar?: string
    bio?: string
    skills: string[]
    trustScore: number
    userId: FreelancerUser
}

interface MyReview {
    _id: string
    rating: number
    comment: string
    createdAt: string
    isFake: boolean
    freelancerId: FreelancerInfo
}

export default function MyReviews() {
    const { user } = useAuth('client')
    const router = useRouter()

    const [reviews, setReviews] = useState<MyReview[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                const res = await axiosInstance.get('/reviews/my')
                setReviews(res.data.reviews || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchMyReviews()
    }, [user])

    if (!user || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10" />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 sm:px-8 lg:px-12 mt-10">
            <div className="max-w-4xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 mb-10 text-xs uppercase tracking-[0.15em]
                        text-slate-400 hover:text-indigo-500 transition-colors duration-200"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Dashboard
                </button>

                {/* Header */}
                <div className="mb-12">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Your activity</p>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.02]">
                        My Reviews
                    </h1>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-light mt-3">
                        {reviews.length === 0
                            ? 'You haven\'t reviewed anyone yet.'
                            : `You've reviewed ${reviews.length} freelancer${reviews.length > 1 ? 's' : ''}.`}
                    </p>
                </div>

                {/* Empty state */}
                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-5 py-24
                        border border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04]
                            flex items-center justify-center">
                            <Star className="w-6 h-6 text-slate-300 dark:text-white/20" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No reviews yet</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Complete a job and share your experience
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/client/browse')}
                            className="text-xs text-indigo-500 border border-indigo-500/30
                                px-4 py-2 rounded-full hover:bg-indigo-500/10 transition-all"
                        >
                            Browse Experts
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review, i) => {
                            const freelancer = review.freelancerId
                            const name = freelancer?.userId?.name || 'Unknown'
                            const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                            const score = freelancer?.trustScore || 0
                            const scoreAccent = score >= 90 ? '#10b981' : score >= 70 ? '#6366f1' : '#f59e0b'
                            const scoreDeg = `${Math.round(score * 3.6)}deg`

                            return (
                                <div key={review._id}
                                    className="group relative overflow-hidden rounded-2xl
                                        bg-slate-50 dark:bg-white/[0.02]
                                        border border-slate-100 dark:border-white/[0.06]
                                        hover:border-slate-200 dark:hover:border-white/[0.1]
                                        p-5 sm:p-6 transition-all duration-200">

                                    {/* watermark */}
                                    <span className="absolute top-4 right-5 text-6xl font-black
                                        text-slate-100 dark:text-white/[0.03]
                                        select-none pointer-events-none leading-none">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">

                                        {/* Left: freelancer info */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Avatar */}
                                            {freelancer?.avatar ? (
                                                <img
                                                    src={freelancer.avatar}
                                                    alt={name}
                                                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl flex-shrink-0
                                                    bg-gradient-to-br from-indigo-500 to-violet-600
                                                    flex items-center justify-center
                                                    text-white text-base font-black">
                                                    {initials}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                                                    {name}
                                                </p>
                                                {freelancer?.skills?.length > 0 && (
                                                    <p className="text-xs text-slate-400 truncate mt-0.5">
                                                        {freelancer.skills.slice(0, 3).join(' · ')}
                                                    </p>
                                                )}
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: trust score mini ring */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="relative w-12 h-12 flex items-center justify-center"
                                                style={{
                                                    background: `conic-gradient(${scoreAccent} 0deg ${scoreDeg}, ${scoreAccent}22 ${scoreDeg} 360deg)`,
                                                    borderRadius: '50%',
                                                }}>
                                                <div className="absolute inset-[3px] rounded-full
                                                    bg-white dark:bg-[#0a0b14]
                                                    flex flex-col items-center justify-center">
                                                    <Zap className="w-2.5 h-2.5" style={{ color: scoreAccent }} />
                                                    <span className="text-[10px] font-black text-slate-900 dark:text-white leading-none">
                                                        {score}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => router.push(`/dashboard/client/freelancers/${freelancer._id}`)}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold
                                                    text-indigo-500 border border-indigo-500/30
                                                    px-3 py-1.5 rounded-full
                                                    hover:bg-indigo-500/10 transition-all"
                                            >
                                                View
                                                <ArrowUpRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Divider */}
                                    <div className="relative h-px bg-slate-100 dark:bg-white/[0.05] my-4" />

                                    {/* Review content */}
                                    <div className="relative flex items-start justify-between gap-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                                            {review.comment}
                                        </p>
                                        <div className="flex items-center gap-0.5 flex-shrink-0 pt-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className="w-3.5 h-3.5"
                                                    fill={review.rating >= star ? '#f59e0b' : 'none'}
                                                    stroke={review.rating >= star ? '#f59e0b' : '#e2e8f0'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Fake badge */}
                                    {review.isFake && (
                                        <div className="relative mt-3 inline-flex items-center gap-1.5
                                            text-[10px] font-semibold uppercase tracking-wider
                                            text-amber-600 dark:text-amber-400
                                            bg-amber-50 dark:bg-amber-500/10
                                            border border-amber-200 dark:border-amber-500/20
                                            px-2.5 py-1 rounded-full">
                                            ⚠ Under Review
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}