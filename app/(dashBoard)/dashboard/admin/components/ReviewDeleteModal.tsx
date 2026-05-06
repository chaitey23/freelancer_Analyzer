import { Trash2 } from 'lucide-react'
import { AdminReview } from '../users/reviewTypes'

interface ReviewDeleteModalProps {
    review: AdminReview
    isDeleting: boolean
    onConfirm: (reviewId: string) => void
    onCancel: () => void
}

export default function ReviewDeleteModal({
    review,
    isDeleting,
    onConfirm,
    onCancel,
}: ReviewDeleteModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 backdrop-blur-md" onClick={onCancel} aria-hidden="true" />

            <div className="relative bg-[#0f172a] border border-white/10 rounded-[2rem] p-8
                            w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl
                                flex items-center justify-center mb-6">
                    <Trash2 className="w-6 h-6 text-red-400" />
                </div>

                <h3 className="text-white font-black text-2xl mb-2 tracking-tight">Delete Review</h3>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                    Review by <span className="text-white font-bold">{review.clientId?.name}</span> will be permanently removed.
                </p>
                <p className="text-slate-600 text-xs mb-8 italic line-clamp-2">
                    `{review.comment}`
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08]
                                   text-slate-300 text-xs font-black uppercase tracking-widest transition-all"
                    >
                        Abort
                    </button>
                    <button
                        onClick={() => onConfirm(review._id)}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400
                                   text-white text-xs font-black uppercase tracking-widest
                                   transition-all disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    )
}