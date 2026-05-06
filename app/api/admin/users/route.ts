// import { NextRequest, NextResponse } from 'next/server'
// import User from '@/models/User'
// import { getTokenData } from '@/lib/auth'
// import { connectDB } from '@/lib/mongodb'

// export async function GET(req: NextRequest) {
//     try {
//         const tokenData = getTokenData(req)

//         if (!tokenData || tokenData.role !== 'admin') {
//             return NextResponse.json(
//                 { message: 'Unauthorized' },
//                 { status: 401 }
//             )
//         }

//         await connectDB()

//         const users = await User.find({})
//             .select('_id name email role createdAt banned')
//             .sort({ createdAt: -1 })
//             .lean()

//         return NextResponse.json({ users }, { status: 200 })

//     } catch (error) {
//         console.error('[ADMIN GET USERS]', error)
//         return NextResponse.json(
//             { message: 'Internal Server Error' },
//             { status: 500 }
//         )
//     }
// }
import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/User'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
    try {
        const tokenData = getTokenData(req)

        if (!tokenData || tokenData.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        await connectDB()

        const users = await User.find({})
            .select('_id name email role createdAt banned')
            .sort({ createdAt: -1 })
            .lean()

        // freelancer role এর user দের জন্য freelancer _id খুঁজে নিন
        const freelancerUsers = users.filter(u => u.role === 'freelancer')
        const freelancers = await Freelancer.find({
            userId: { $in: freelancerUsers.map(u => u._id) }
        }).select('_id userId').lean()

        // userId → freelancer._id map বানান
        const freelancerMap = new Map(
            freelancers.map(f => [f.userId.toString(), f._id.toString()])
        )

        // প্রতিটা user এ freelancerId যোগ করুন
        const usersWithFreelancerId = users.map(u => ({
            ...u,
            freelancerId: u.role === 'freelancer'
                ? freelancerMap.get(u._id.toString()) || null
                : null
        }))

        return NextResponse.json({ users: usersWithFreelancerId }, { status: 200 })

    } catch (error) {
        console.error('[ADMIN GET USERS]', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}