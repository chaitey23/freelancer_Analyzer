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
            else router.push('/')

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
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden bg-transparent mt-24">

            {/* Background Glow -  */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative w-full max-w-md z-10">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Login to your account
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                className={`w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 ${errors.email ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                                    }`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-400 text-[10px] ml-2 italic">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className={`w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 ${errors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                                    }`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-400 text-[10px] ml-2 italic">{errors.password}</p>}
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group mt-4 overflow-hidden rounded-2xl p-[1px] font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:scale-105"></div>
                            <div className="relative bg-slate-900/20 group-hover:bg-transparent py-4 rounded-2xl transition-all flex items-center justify-center text-white">
                                {loading ? 'Logging in...' : 'Login'}
                            </div>
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}