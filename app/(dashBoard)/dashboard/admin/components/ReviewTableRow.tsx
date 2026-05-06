import { Trash2, Star, MessageSquare, Flag } from 'lucide-react'

import ActionButton from './ActionButton'
import { AdminReview } from '../users/reviewTypes'

interface ReviewTableRowProps {
    review: AdminReview
    isLoading: boolean
    onDeleteRequest: (review: AdminReview) => void
    onFlag: (reviewId: string, currentIsFake: boolean) => void
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className="w-3 h-3"
                    fill={rating >= star ? '#f59e0b' : 'none'}
                    stroke={rating >= star ? '#f59e0b' : '#334155'}
                />
            ))}
        </div>
    )
}

export default function ReviewTableRow({
    review,
    isLoading,
    onDeleteRequest,
    onFlag,
}: ReviewTableRowProps) {
    const freelancerName = review.freelancerId?.userId?.name || 'Unknown'
    const clientName = review.clientId?.name || 'Unknown'

    return (
        <tr className="group transition-all">
            {/* Reviewer */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04]
                           first:rounded-l-[1.5rem] px-6 py-4
                           border-y border-l border-white/[0.04]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10
                                    flex items-center justify-center text-xs font-black text-emerald-400
                                    border border-white/[0.08] flex-shrink-0">
                        {clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-tight">{clientName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{review.clientId?.email}</p>
                    </div>
                </div>
            </td>

            {/* Freelancer */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10
                                    flex items-center justify-center text-xs font-black text-indigo-400
                                    border border-white/[0.08] flex-shrink-0">
                        {freelancerName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold text-white">{freelancerName}</p>
                </div>
            </td>

            {/* Rating */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04]">
                <div className="flex flex-col gap-1">
                    <StarRating rating={review.rating} />
                    <span className="text-[10px] font-black text-amber-500">{review.rating}/5</span>
                </div>
            </td>

            {/* Comment */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04] max-w-xs">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {review.comment}
                </p>
                {review.reply?.comment && (
                    <div className="flex items-center gap-1 mt-1.5">
                        <MessageSquare className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] text-indigo-400">Has reply</span>
                    </div>
                )}
            </td>

            {/* Date */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04]">
                <p className="text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
            </td>

            {/* Actions */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04]
                           last:rounded-r-[1.5rem] px-6 py-4
                           border-y border-r border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <ActionButton
                        icon={Flag}
                        color={review.isFake ? 'amber' : 'indigo'}
                        title={review.isFake ? 'Unflag' : 'Flag as Suspicious'}
                        disabled={isLoading}
                        onClick={() => onFlag(review._id, review.isFake)}
                    />
                    <ActionButton
                        icon={Trash2}
                        color="red"
                        title="Delete Review"
                        disabled={isLoading}
                        onClick={() => onDeleteRequest(review)}
                    />
                </div>
            </td>
        </tr>
    )
}