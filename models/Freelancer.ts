import mongoose, { Schema, Document } from 'mongoose'

export interface IFreelancer extends Document {
    userId: mongoose.Types.ObjectId
    skills: string[]
    experience: string
    portfolio: string
    trustScore: number
    bio: string
    avatar: string
    totalProjects: number
    jobSuccessRate: number
    responseRate: number
    platform: string
    yearsOfExperience: number
    aiReport: string
}

const FreelancerSchema = new Schema<IFreelancer>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skills: [{ type: String }],
    experience: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    trustScore: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    jobSuccessRate: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    platform: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    aiReport: { type: String, default: '' },
})

export default mongoose.models.Freelancer || mongoose.model<IFreelancer>('Freelancer', FreelancerSchema)