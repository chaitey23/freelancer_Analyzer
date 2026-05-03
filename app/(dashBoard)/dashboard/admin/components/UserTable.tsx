import { ShieldAlert } from 'lucide-react'
import { AdminUser } from '../AdminTypes'
import UserTableRow from './UserTableRow'

interface UserTableProps {
    users: AdminUser[]
    currentUserId: string
    actionLoadingId: string | null
    onBan: (userId: string, currentBanStatus: boolean) => void
    onDeleteRequest: (user: AdminUser) => void
}

const TABLE_HEADERS = ['Identity', 'Privilege', 'Registered', 'Account Status', 'Control']

export default function UserTable({
    users,
    currentUserId,
    actionLoadingId,
    onBan,
    onDeleteRequest,
}: UserTableProps) {
    if (users.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="inline-flex p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] mb-4">
                    <ShieldAlert className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    No records found matching your criteria.
                </p>
            </div>
        )
    }

    return (
        <table className="w-full border-separate border-spacing-y-3">
            <thead>
                <tr className="text-left">
                    {TABLE_HEADERS.map((header) => (
                        <th
                            key={header}
                            className="px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {users.map((u) => (
                    <UserTableRow
                        key={u._id}
                        user={u}
                        currentUserId={currentUserId}
                        isLoading={actionLoadingId === u._id}
                        onBan={onBan}
                        onDeleteRequest={onDeleteRequest}
                    />
                ))}
            </tbody>
        </table>
    )
}