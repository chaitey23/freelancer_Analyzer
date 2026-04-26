'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { ArrowLeft, Star, MessageSquare, TrendingUp, Award, AlertCircle } from 'lucide-react'
import ReviewReplyButton from '@/components/review/ReviewReplyButton'

interface Review {
    _id: string
    rating: number
    comment: string
    createdAt: string
    isFake: boolean
    clientId: {
        _id: string
        name: string
    }
    reply?: { comment: string; createdAt: string }
}

export default function FreelancerReviews() {
    const { user } = useAuth('freelancer')
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [freelancerId, setFreelancerId] = useState<string>('')

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosInstance.get('/reviews/my-freelancer')
                setReviews(res.data.reviews || [])
                setFreelancerId(res.data.freelancerId || '')
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchReviews()
    }, [user])

    if (!user || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10" />
            </div>
        </div>
    )

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '—'

    const fakeCount = reviews.filter(r => r.isFake).length

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
                <div className="mb-10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Your reputation</p>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.02]">
                        My Reviews
                    </h1>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-light mt-3">
                        {reviews.length === 0
                            ? 'No reviews yet. Complete jobs to get reviewed.'
                            : `You have ${reviews.length} review${reviews.length > 1 ? 's' : ''} from clients.`}
                    </p>
                </div>

                {/* Stats */}
                {reviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-10">
                        {[
                            { icon: MessageSquare, label: 'Total Reviews', value: reviews.length },
                            { icon: TrendingUp, label: 'Avg Rating', value: avgRating },
                            { icon: Award, label: 'Under Review', value: fakeCount },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl
                                bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center
                                    bg-indigo-50 dark:bg-indigo-500/10 flex-shrink-0">
                                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty */}
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
                                Complete jobs and clients will review you here
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review, i) => (
                            <div key={review._id}
                                className="group relative overflow-hidden rounded-2xl
                                    bg-slate-50 dark:bg-white/[0.02]
                                    border border-slate-100 dark:border-white/[0.06]
                                    hover:border-slate-200 dark:hover:border-white/[0.1]
                                    p-5 sm:p-6 transition-all duration-200">

                                {/* Watermark */}
                                <span className="absolute top-4 right-5 text-6xl font-black
                                    text-slate-100 dark:text-white/[0.03]
                                    select-none pointer-events-none leading-none">
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">

                                    {/* Client info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-2xl flex-shrink-0
                                            bg-gradient-to-br from-indigo-500 to-violet-600
                                            flex items-center justify-center
                                            text-white text-base font-black">
                                            {review.clientId?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                                                {review.clientId?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-1">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className="w-4 h-4"
                                                fill={review.rating >= star ? '#f59e0b' : 'none'}
                                                stroke={review.rating >= star ? '#f59e0b' : '#e2e8f0'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative h-px bg-slate-100 dark:bg-white/[0.05] my-4" />

                                {/* Comment */}
                                <p className="relative text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {review.comment}
                                </p>
                                <ReviewReplyButton
                                    reviewId={review._id}
                                    freelancerId={freelancerId}
                                    existingReply={review.reply}
                                />

                                {/* Fake badge */}
                                {review.isFake && (
                                    <div className="relative mt-3 inline-flex items-center gap-1.5
                                        text-[10px] font-semibold uppercase tracking-wider
                                        text-amber-600 dark:text-amber-400
                                        bg-amber-50 dark:bg-amber-500/10
                                        border border-amber-200 dark:border-amber-500/20
                                        px-2.5 py-1 rounded-full">
                                        <AlertCircle className="w-3 h-3" />
                                        Under Review
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}