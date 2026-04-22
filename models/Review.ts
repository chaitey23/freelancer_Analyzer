import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
    freelancerId: mongoose.Types.ObjectId
    clientId: mongoose.Types.ObjectId
    rating: number
    comment: string
    isFake: boolean
    createdAt: Date
}

const ReviewSchema = new Schema<IReview>({
    freelancerId: { type: Schema.Types.ObjectId, ref: 'Freelancer', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isFake: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)