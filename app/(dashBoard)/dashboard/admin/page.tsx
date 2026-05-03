'use client'

import { useState, useMemo, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAdminData } from './hooks/useAdminData'

import StatsGrid from './components/StatsGrid'
import FilterBar from './components/FilterBar'
import UserTable from './components/UserTable'
import DeleteModal from './components/DeleteModal'
import { AdminUser, RoleFilter } from './AdminTypes'

export default function AdminDashboard() {
    const { user } = useAuth('admin')

    const { users, stats, loading, actionLoading, fetchData, deleteUser, toggleBan } =
        useAdminData()

    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
    const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null)

    useEffect(() => {
        if (user) fetchData()
    }, [user, fetchData])

    const filteredUsers = useMemo(() =>
        users.filter((u) => {
            const matchSearch =
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
            const matchRole = roleFilter === 'all' || u.role === roleFilter
            return matchSearch && matchRole
        }),
        [users, search, roleFilter]
    )

    const handleDeleteConfirm = async (userId: string) => {
        const success = await deleteUser(userId)
        if (success) setConfirmDelete(null)
    }

    if (!user || loading) {
        return <DashboardLoader />
    }

    return (
        <div className="min-h-screen text-slate-300 pb-20 selection:bg-indigo-500/30">
            {/* Ambient background glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">

                {/* Page Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                System Control
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Command{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                Center
                            </span>
                        </h1>
                    </div>

                    <button
                        onClick={fetchData}
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl
                                   bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08]
                                   transition-all active:scale-95 w-fit"
                    >
                        <RefreshCw
                            className={`w-4 h-4 text-indigo-400 transition-transform duration-700
                                        ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`}
                        />
                        <span className="text-sm font-bold text-white">Sync Database</span>
                    </button>
                </header>

                {/* Stats */}
                {stats && <StatsGrid stats={stats} />}

                {/* User Directory Panel */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem]
                                overflow-hidden backdrop-blur-md relative z-10">
                    <FilterBar
                        search={search}
                        onSearchChange={setSearch}
                        roleFilter={roleFilter}
                        onRoleFilterChange={setRoleFilter}
                        resultCount={filteredUsers.length}
                    />

                    <div className="overflow-x-auto px-6 pb-6">
                        <UserTable
                            users={filteredUsers}
                            currentUserId={user.id}
                            actionLoadingId={actionLoading}
                            onBan={toggleBan}
                            onDeleteRequest={setConfirmDelete}
                        />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <DeleteModal
                    user={confirmDelete}
                    isDeleting={actionLoading === confirmDelete._id}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    )
}

function DashboardLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20
                                border-t-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-emerald-500/20
                                border-t-emerald-500 animate-spin [animation-duration:1.5s]" />
            </div>
        </div>
    )
}