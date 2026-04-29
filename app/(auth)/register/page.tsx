'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'
import axios from 'axios'

export default function RegisterPage() {
    const router = useRouter()
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
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className={inputClasses(errors.password)}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.password}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                                Register As
                            </label>
                            <select
                                name="role"
                                className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer backdrop-blur-sm"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="client" className="dark:bg-[#12141d]">Client</option>
                                <option value="freelancer" className="dark:bg-[#12141d]">Freelancer</option>
                            </select>
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