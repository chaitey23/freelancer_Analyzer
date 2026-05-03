import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/User'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tokenData = getTokenData(req)

        if (!tokenData || tokenData.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        await connectDB()

        const { id } = params

        if (tokenData.userId === id) {
            return NextResponse.json(
                { message: 'You cannot delete your own account' },
                { status: 403 }
            )
        }

        const user = await User.findById(id)
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        if (user.role === 'freelancer') {
            await Freelancer.findOneAndDelete({ userId: id })
        }

        await User.findByIdAndDelete(id)

        return NextResponse.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        )

    } catch (error) {
        console.error('[ADMIN DELETE USER]', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}