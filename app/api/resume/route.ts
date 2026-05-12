import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')
    if (!url) return new NextResponse('Missing URL', { status: 400 })

    try {
        const response = await fetch(url)
        const buffer = await response.arrayBuffer()

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
            },
        })
    } catch {
        return new NextResponse('Failed to fetch PDF', { status: 500 })
    }
}