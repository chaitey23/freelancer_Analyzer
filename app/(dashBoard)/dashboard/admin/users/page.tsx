'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AdminUsers() {
    const router = useRouter()
    const { user, logout } = useAuth("admin")

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">24</p>
                        <p className="text-gray-500 text-sm mt-1">Total Users</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">12</p>
                        <p className="text-gray-500 text-sm mt-1">Freelancers</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">10</p>
                        <p className="text-gray-500 text-sm mt-1">Clients</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4 text-sm text-gray-600">Name</th>
                                <th className="text-left p-4 text-sm text-gray-600">Email</th>
                                <th className="text-left p-4 text-sm text-gray-600">Role</th>
                                <th className="text-left p-4 text-sm text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-gray-800">User {i}</td>
                                    <td className="p-4 text-gray-500">user{i}@example.com</td>
                                    <td className="p-4">
                                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                            freelancer
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-red-500 text-sm hover:underline">Block</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}