import { MessageSquareOff } from 'lucide-react'
import ReviewTableRow from './ReviewTableRow'
import { AdminReview } from '../users/reviewTypes'

interface ReviewTableProps {
    reviews: AdminReview[]
    actionLoadingId: string | null
    onDeleteRequest: (review: AdminReview) => void
    onFlag: (reviewId: string, currentIsFake: boolean) => void
}

const TABLE_HEADERS = ['Reviewer', 'Freelancer', 'Rating', 'Comment', 'Date', 'Control']

export default function ReviewTable({
    reviews,
    actionLoadingId,
    onDeleteRequest,
    onFlag,
}: ReviewTableProps) {
    if (reviews.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="inline-flex p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] mb-4">
                    <MessageSquareOff className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    No reviews found matching your criteria.
                </p>
            </div>
        )
    }

    return (
        <table className="w-full border-separate border-spacing-y-3">
            <thead>
                <tr className="text-left">
                    {TABLE_HEADERS.map(header => (
                        <th
                            key={header}
                            className="px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {reviews.map(review => (
                    <ReviewTableRow
                        key={review._id}
                        review={review}
                        isLoading={actionLoadingId === review._id}
                        onDeleteRequest={onDeleteRequest}
                        onFlag={onFlag}
                    />
                ))}
            </tbody>
        </table>
    )
}