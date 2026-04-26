'use client'
import { useState } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import axiosInstance from '@/lib/axios'

interface Props {
    reviewId: string
    freelancerId: string
    existingReply?: { comment: string; createdAt: string }
    onReplied?: (reply: { comment: string; createdAt: string }) => void
}

export default function ReviewReplyButton({ reviewId, freelancerId, existingReply, onReplied }: Props) {
    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [reply, setReply] = useState(existingReply)

    const handleSubmit = async () => {
        if (!comment.trim()) return
        setLoading(true)
        try {
            const res = await axiosInstance.post(`/reviews/${freelancerId}/reply`, {
                reviewId,
                comment
            })
            const newReply = res.data.review.reply
            setReply(newReply)
            onReplied?.(newReply)
            setOpen(false)
            setComment('')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (reply?.comment) {
        return (
            <div className="mt-4 pl-4 border-l-2 border-indigo-500/30">
                <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold mb-1">
                    Your Reply
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {reply.comment}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(reply.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    })}
                </p>
            </div>
        )
    }

    return (
        <div className="mt-4">
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium
                        text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                    <MessageSquare className="w-3.5 h-3.5 " />
                    Reply to this review
                </button>
            ) : (
                <div className="space-y-2">
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                        className="w-full text-sm px-3 py-2 rounded-xl resize-none
                            bg-white dark:bg-white/[0.04]
                            border border-slate-200 dark:border-white/10
                            text-slate-800 dark:text-slate-100
                            placeholder:text-slate-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !comment.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5
                                text-xs font-semibold rounded-lg
                                bg-indigo-500 hover:bg-indigo-600
                                text-white transition-colors disabled:opacity-50"
                        >
                            <Send className="w-3 h-3" />
                            {loading ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                            onClick={() => { setOpen(false); setComment('') }}
                            className="inline-flex items-center gap-1 px-3 py-1.5
                                text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}