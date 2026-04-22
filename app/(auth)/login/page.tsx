'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'
import axios from 'axios'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const newErrors = { email: '', password: '' }
        let isValid = true

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
            isValid = false
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setServerError('')

        if (!validate()) return

        setLoading(true)

        try {
            const res = await axiosInstance.post('/auth/login', formData)
            const { user } = res.data

            localStorage.setItem('user', JSON.stringify(user))

            if (user.role === 'admin') router.push('/dashboard/admin')
            else if (user.role === 'freelancer') router.push('/dashboard/freelancer/profile')
            else router.push('/dashboard/client/browse')

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setServerError(err.response?.data?.message || 'Something went wrong')
            } else {
                setServerError('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Login to your account
                </p>

                {serverError && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                        Register here
                    </Link>
                </p>

            </div>
        </div>
    )
}