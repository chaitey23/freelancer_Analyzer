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
    const [showPassword, setShowPassword] = useState(false)

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

    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        setServerError('')

        if (!validate()) return

        setLoading(true)

        try {
            const res = await axiosInstance.post('/auth/login', formData)
            const { user } = res.data

            localStorage.setItem('user', JSON.stringify(user))
            window.dispatchEvent(new Event('storage'))

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

            {/* Background Glow */}
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
                                className={`w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 ${errors.email ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}
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
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    className={`w-full bg-white/5 border rounded-2xl px-5 py-3.5 pr-12 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 ${errors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-between ml-1">
                                {errors.password
                                    ? <p className="text-red-400 text-[10px] italic">{errors.password}</p>
                                    : <span />
                                }
                                <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-[11px] font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Server Error */}
                        {serverError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                                {serverError}
                            </div>
                        )}

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