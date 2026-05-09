import { NextRequest, NextResponse } from 'next/server'
import Review from '@/models/Review'
import { verifyAdmin } from '@/lib/verifyAdmin'
import { connectDB } from '@/lib/mongodb'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    await connectDB()

    const { id } = await params
    await Review.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
}