import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Proposal from '@/models/Proposal'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'
export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { freelancerId, rating, comment } = await req.json()
        if (!freelancerId || !rating || !comment) {
            return NextResponse.json({ message: 'All fields required' }, { status: 400 })
        }

        const completedProposal = await Proposal.findOne({
            clientId: tokenData.userId,
            freelancerId,
            status: 'completed'
        })
        if (!completedProposal) {
            return NextResponse.json({ message: 'You can only review after completing a job' }, { status: 403 })
        }

        const existingReview = await Review.findOne({
            clientId: tokenData.userId,
            freelancerId
        })
        if (existingReview) {
            return NextResponse.json({ message: 'You have already reviewed this freelancer' }, { status: 400 })
        }

        // Fake review detection
        const recentReviews = await Review.find({
            freelancerId,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        })
        const isFake =
            comment.trim().split(' ').length < 3 ||
            (rating === 5 && recentReviews.length >= 3)

        const review = await Review.create({
            freelancerId,
            clientId: tokenData.userId,
            rating,
            comment,
            isFake
        })

        // Trust Score update
        const allReviews = await Review.find({ freelancerId, isFake: false })
        const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : rating
        const fakeCount = await Review.countDocuments({ freelancerId, isFake: true })
        const repeatClients = await Proposal.countDocuments({ freelancerId, status: 'completed' })

        const trustScore = Math.min(100, Math.round(
            (avgRating * 20) + (repeatClients * 5) - (fakeCount * 10)
        ))

        await Freelancer.findByIdAndUpdate(freelancerId, { trustScore })

        return NextResponse.json({ message: 'Review added', review }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}