import { useState, useCallback } from 'react'
import axiosInstance from '@/lib/axios'
import { AdminReview } from '../users/reviewTypes'

export function useAdminReviews() {
    const [reviews, setReviews] = useState<AdminReview[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get('/admin/reviews')
            setReviews(res.data.reviews)
        } catch (err) {
            console.error('Error fetching reviews:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteReview = useCallback(async (reviewId: string) => {
        setActionLoading(reviewId)
        try {
            await axiosInstance.delete(`/admin/reviews/${reviewId}`)
            setReviews(prev => prev.filter(r => r._id !== reviewId))
            return true
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setActionLoading(null)
        }
    }, [])

    const flagReview = useCallback(async (reviewId: string, currentIsFake: boolean) => {
        setActionLoading(reviewId)
        try {
            await axiosInstance.patch(`/admin/reviews/${reviewId}/flag`)
            setReviews(prev =>
                prev.map(r => r._id === reviewId ? { ...r, isFake: !currentIsFake } : r)
            )
        } catch (err) {
            console.error(err)
        } finally {
            setActionLoading(null)
        }
    }, [])

    return { reviews, loading, actionLoading, fetchReviews, deleteReview, flagReview }
}