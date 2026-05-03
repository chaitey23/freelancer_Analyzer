import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: 'admin' | 'freelancer' | 'client'
    createdAt: Date
    avatar?: string
    banned: boolean
}
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'freelancer', 'client'],
        default: 'client'
    },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: String, default: '' },
    banned: { type: Boolean, default: false }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)