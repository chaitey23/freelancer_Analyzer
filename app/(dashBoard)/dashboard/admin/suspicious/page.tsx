'use client'
import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ShieldAlert } from 'lucide-react'
import { useAdminReviews } from '../hooks/useAdminReviews'
import { AdminReview } from '../users/reviewTypes'
import ReviewTable from '../components/ReviewTable'
import ReviewDeleteModal from '../components/ReviewDeleteModal'
import AdminLoader from '../shared/Adminloader '
export default function SuspiciousPage() {
    const { user } = useAuth('admin')
    const { reviews, loading, actionLoading, fetchReviews, deleteReview, flagReview } =
        useAdminReviews()

    const [confirmDelete, setConfirmDelete] = useState<AdminReview | null>(null)

    useEffect(() => {
        if (user) fetchReviews()
    }, [user, fetchReviews])
    const suspiciousReviews = useMemo(() =>
        reviews.filter(r => r.isFake),
        [reviews]
    )

    const handleDeleteConfirm = async (reviewId: string) => {
        const success = await deleteReview(reviewId)
        if (success) setConfirmDelete(null)
    }

    if (!user || loading) return <AdminLoader></AdminLoader>

    return (
        <div className="pt-24 px-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem] overflow-hidden backdrop-blur-md">

                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/[0.06] flex items-center gap-4">
                    <div className="h-10 w-1 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                            Suspicious Reviews
                        </h2>
                        <p className="text-xs text-slate-500">
                            {suspiciousReviews.length} flagged {suspiciousReviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <ReviewTable
                        reviews={suspiciousReviews}
                        actionLoadingId={actionLoading}
                        onDeleteRequest={setConfirmDelete}
                        onFlag={flagReview}
                    />
                </div>
            </div>

            {confirmDelete && (
                <ReviewDeleteModal
                    review={confirmDelete}
                    isDeleting={actionLoading === confirmDelete._id}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    )
}