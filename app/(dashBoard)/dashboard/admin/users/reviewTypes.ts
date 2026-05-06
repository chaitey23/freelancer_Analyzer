export interface AdminReview {
    _id: string
    rating: number
    comment: string
    isFake: boolean
    createdAt: string
    clientId: {
        _id: string
        name: string
        email: string
    }
    freelancerId: {
        _id: string
        userId: {
            name: string
            email: string
        }
    }
    reply?: {
        comment: string
        createdAt: string
    }
}

export type RatingFilter = 'all' | '1' | '2' | '3' | '4' | '5'