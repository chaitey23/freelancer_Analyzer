import { NextRequest, NextResponse } from 'next/server'
import Review from '@/models/Review'
import { connectDB } from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/verifyAdmin'
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = verifyAdmin(req)
    if (authError) return authError

    await connectDB()

    const { id } = await params  // ← await করো

    const review = await Review.findById(id)
    if (!review) {
        return NextResponse.json({ message: 'Review not found' }, { status: 404 })
    }

    review.isFake = !review.isFake
    await review.save()

    return NextResponse.json({ success: true, isFake: review.isFake })
}