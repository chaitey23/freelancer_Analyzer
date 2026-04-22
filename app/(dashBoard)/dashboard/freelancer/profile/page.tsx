'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function FreelancerProfile() {
    const router = useRouter()
    const { user, logout } = useAuth('freelancer')


    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                            <p className="text-gray-500">{user.email}</p>
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Trust Score */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Trust Score</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full border-8 border-green-400 flex items-center justify-center">
                            <span className="text-2xl font-bold text-green-600">85</span>
                        </div>
                        <div>
                            <p className="text-gray-600">Your trust score is <strong>Excellent</strong></p>
                            <p className="text-sm text-gray-400 mt-1">Based on reviews and client feedback</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">12</p>
                        <p className="text-gray-500 text-sm mt-1">Total Reviews</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">4.8</p>
                        <p className="text-gray-500 text-sm mt-1">Avg Rating</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">8</p>
                        <p className="text-gray-500 text-sm mt-1">Repeat Clients</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>

            </div>
        </div>
    )
}