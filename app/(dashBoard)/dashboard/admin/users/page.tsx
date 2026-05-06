'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AdminUser, RoleFilter } from '../AdminTypes'
import { useAdminData } from '../hooks/useAdminData'
import UserTable from '../components/UserTable'
import FilterBar from '../components/FilterBar'
import DeleteModal from '../components/DeleteModal'


export default function UsersPage() {
    const { user } = useAuth('admin')
    const { users, loading, actionLoading, fetchData, deleteUser, toggleBan } = useAdminData()

    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
    const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null)

    useEffect(() => {
        if (user) fetchData()
    }, [user, fetchData])

    const filteredUsers = useMemo(() =>
        users.filter(u => {
            const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
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

    if (!user || loading) return null

    return (
        <div className='pt-24 px-4'>
            <div className=" border border-white/[0.06] rounded-[2.5rem] overflow-hidden backdrop-blur-md">
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

                {confirmDelete && (
                    <DeleteModal
                        user={confirmDelete}
                        isDeleting={actionLoading === confirmDelete._id}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(null)}
                    />
                )}
            </div>
        </div>
    )
}