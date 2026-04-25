import mongoose, { Schema, Document } from 'mongoose'

export interface IProposal extends Document {
    clientId: mongoose.Types.ObjectId
    freelancerId: mongoose.Types.ObjectId
    message: string
    status: 'pending' | 'accepted' | 'rejected' | 'completed'
    createdAt: Date
}

const ProposalSchema = new Schema<IProposal>({
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: 'Freelancer', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
}, { timestamps: true })

export default mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', ProposalSchema)