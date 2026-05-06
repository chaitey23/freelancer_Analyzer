import { Trash2 } from 'lucide-react'
import { AdminUser } from '../AdminTypes'

interface DeleteModalProps {
    user: AdminUser
    isDeleting: boolean
    onConfirm: (userId: string) => void
    onCancel: () => void
}

export default function DeleteModal({
    user,
    isDeleting,
    onConfirm,
    onCancel,
}: DeleteModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-md"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative bg-[#0f172a] border border-white/10 rounded-[2rem] p-8
                            w-full max-w-sm shadow-2xl overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl
                                flex items-center justify-center mb-6">
                    <Trash2 className="w-6 h-6 text-red-400" />
                </div>

                <h3 className="text-white font-black text-2xl mb-2 tracking-tight">
                    Confirm Deletion
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    You are about to remove{' '}
                    <span className="text-white font-bold">{user.name}</span>.
                    All associated data will be purged. This action is irreversible.
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
                        onClick={() => onConfirm(user._id)}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400
                                   text-white text-xs font-black uppercase tracking-widest
                                   transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {isDeleting ? 'Processing...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    )
}