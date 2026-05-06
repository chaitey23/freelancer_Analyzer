import { NextRequest, NextResponse } from 'next/server'
import { getTokenData } from '@/lib/auth'

export function verifyAdmin(req: NextRequest): NextResponse | null {
    const tokenData = getTokenData(req)

    if (!tokenData || tokenData.role !== 'admin') {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        )
    }

    return null
}