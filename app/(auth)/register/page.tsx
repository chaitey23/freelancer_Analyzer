'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'
import axios from 'axios'

export default function RegisterPage() {
    const router = useRouter()
    const [roleOpen, setRoleOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const roles = [
        { value: 'client', label: 'Client' },
        { value: 'freelancer', label: 'Freelancer' },
        { value: 'admin', label: 'Admin' },
    ]
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client'
    })
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const newErrors = { name: '', email: '', password: '' }
        let isValid = true

        if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
            isValid = false
        }

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
            await axiosInstance.post('/auth/register', formData)

            const res = await axiosInstance.post('/auth/login', {
                email: formData.email,
                password: formData.password
            })

            const { user } = res.data
            localStorage.setItem('user', JSON.stringify(user))

            if (user.role === 'freelancer') router.push('/dashboard/freelancer/profile')
            else if (user.role === 'admin') router.push('/dashboard/admin')
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

    const inputClasses = (error: string) => `
        w-full bg-white/50 dark:bg-white/5 
        border ${error ? 'border-red-500' : 'border-slate-300 dark:border-white/10'} 
        rounded-xl px-4 py-3 
        text-slate-900 dark:text-white 
        placeholder-slate-400 dark:placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
        transition-all duration-300 backdrop-blur-sm
    `

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="relative group w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative bg-white/80 dark:bg-[#12141d]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Create <span className="text-indigo-600 dark:text-indigo-400">Account</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                            Join the smart insights revolution
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm font-bold text-center">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className={inputClasses(errors.name)}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                className={inputClasses(errors.email)}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.email}</p>}
                        </div>
                        {/* Password */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    className={inputClasses(errors.password)}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.password}</p>}
                        </div>
                        {/* Role */}
                        <div className="relative">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                                Register As
                            </label>
                            <button
                                type="button"
                                onClick={() => setRoleOpen(!roleOpen)}
                                className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all flex items-center justify-between cursor-pointer"
                            >
                                <span className="font-medium">{roles.find(r => r.value === formData.role)?.label}</span>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {roleOpen && (
                                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, role: role.value })
                                                setRoleOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors
                        ${formData.role === role.value
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group/btn overflow-hidden bg-indigo-600 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">
                                {loading ? 'Creating Account...' : 'Register Now'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </form>

                    <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 mt-8">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}