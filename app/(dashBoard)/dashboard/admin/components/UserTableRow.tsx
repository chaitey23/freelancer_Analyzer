import { Ban, Eye, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminUser } from '../AdminTypes'
import { ROLE_CONFIG } from '../config'
import ActionButton from './ActionButton'

interface UserTableRowProps {
    user: AdminUser
    currentUserId: string
    isLoading: boolean
    onBan: (userId: string, currentBanStatus: boolean) => void
    onDeleteRequest: (user: AdminUser) => void
}

export default function UserTableRow({
    user,
    currentUserId,
    isLoading,
    onBan,
    onDeleteRequest,
}: UserTableRowProps) {
    const router = useRouter()
    const cfg = ROLE_CONFIG[user.role]
    const isSelf = user._id === currentUserId

    return (
        <tr className="group transition-all">
            {/* Identity */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04]
                           first:rounded-l-[1.5rem] px-6 py-4
                           border-y border-l border-white/[0.04]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10
                                    flex items-center justify-center text-xs font-black text-indigo-400
                                    border border-white/[0.08]">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* Role Badge */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04]">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px]
                                  font-black uppercase tracking-widest shadow-sm
                                  ${cfg.bg} border ${cfg.border}`}>
                    <span style={{ color: cfg.color }}>{cfg.label}</span>
                </span>
            </td>

            {/* Registration Date */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04]">
                <p className="text-xs text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
            </td>

            {/* Status */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04] px-6 py-4 border-y border-white/[0.04]">
                {user.banned ? (
                    <div className="flex items-center gap-1.5 text-red-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Suspended</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Active</span>
                    </div>
                )}
            </td>

            {/* Actions */}
            <td className="bg-white/[0.02] group-hover:bg-white/[0.04]
                           last:rounded-r-[1.5rem] px-6 py-4
                           border-y border-r border-white/[0.04]">
                <div className="flex items-center gap-2">
                    {isSelf ? (
                        <span className="text-[10px] font-black uppercase text-indigo-500/40 italic tracking-widest">
                            Master
                        </span>
                    ) : (
                        <>
                            {user.role === 'freelancer' && (
                                <ActionButton
                                    icon={Eye}
                                    color="indigo"
                                    title="View Profile"
                                    onClick={() => router.push(`/freelancers/${user._id}`)}
                                />
                            )}
                            <ActionButton
                                icon={Ban}
                                color={user.banned ? 'emerald' : 'amber'}
                                title={user.banned ? 'Unban' : 'Ban'}
                                disabled={isLoading}
                                onClick={() => onBan(user._id, user.banned || false)}
                            />
                            <ActionButton
                                icon={Trash2}
                                color="red"
                                title="Delete"
                                disabled={isLoading}
                                onClick={() => onDeleteRequest(user)}
                            />
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}