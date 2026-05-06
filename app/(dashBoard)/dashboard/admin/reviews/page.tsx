'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAdminReviews } from '../hooks/useAdminReviews'
import { AdminReview, RatingFilter } from '../users/reviewTypes'
import ReviewFilterBar from '../components/ReviewFilterBar'
import ReviewTable from '../components/ReviewTable'
import ReviewDeleteModal from '../components/ReviewDeleteModal'
import AdminLoader from '../shared/Adminloader '


export default function ReviewPage() {
    const { user } = useAuth('admin')
    const { reviews, loading, actionLoading, fetchReviews, deleteReview, flagReview } = useAdminReviews()

    const [search, setSearch] = useState('')
    const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
    const [confirmDelete, setConfirmDelete] = useState<AdminReview | null>(null)

    useEffect(() => {
        if (user) fetchReviews()
    }, [user, fetchReviews])

    const filteredReviews = useMemo(() =>
        reviews.filter(r => {
            const freelancerName = r.freelancerId?.userId?.name?.toLowerCase() || ''
            const clientName = r.clientId?.name?.toLowerCase() || ''
            const matchSearch = freelancerName.includes(search.toLowerCase()) ||
                clientName.includes(search.toLowerCase())
            const matchRating = ratingFilter === 'all' || r.rating === Number(ratingFilter)
            return matchSearch && matchRating
        }),
        [reviews, search, ratingFilter]
    )

    const handleDeleteConfirm = async (reviewId: string) => {
        const success = await deleteReview(reviewId)
        if (success) setConfirmDelete(null)
    }

    if (!user || loading) return <AdminLoader></AdminLoader>

    return (
        <div className="pt-24 px-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                <ReviewFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    ratingFilter={ratingFilter}
                    onRatingFilterChange={setRatingFilter}
                    resultCount={filteredReviews.length}
                />
                <div className="overflow-x-auto px-6 pb-6">
                    <ReviewTable
                        reviews={filteredReviews}
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