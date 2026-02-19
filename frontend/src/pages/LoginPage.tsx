import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Droplets, Eye, EyeOff, Lock, Mail, ShieldCheck, BarChart3, MapPin } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            login(response.data.access_token, response.data.user);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <Toaster position="top-right" />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center p-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-[50%] left-[50%] w-64 h-64 bg-blue-400/8 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center max-w-lg">
                    <div className="w-20 h-20 mx-auto mb-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/10">
                        <Droplets className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Water Supply</h1>
                    <h2 className="text-2xl font-semibold text-indigo-200 mb-4">Management System</h2>
                    <p className="text-sm text-indigo-300/80 max-w-md mx-auto leading-relaxed">
                        Comprehensive ERP platform for managing water supply infrastructure — from source to consumer, across all operational areas.
                    </p>

                    {/* Feature highlights */}
                    <div className="mt-12 grid grid-cols-3 gap-6">
                        <div className="text-center p-4 rounded-2xl bg-white/[0.05] border border-white/[0.06]">
                            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-indigo-300" />
                            </div>
                            <p className="text-xs font-semibold text-white">Analytics</p>
                            <p className="text-[10px] text-indigo-400 mt-0.5">Real-time insights</p>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-white/[0.05] border border-white/[0.06]">
                            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-indigo-300" />
                            </div>
                            <p className="text-xs font-semibold text-white">GIS Mapping</p>
                            <p className="text-[10px] text-indigo-400 mt-0.5">Spatial tracking</p>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-white/[0.05] border border-white/[0.06]">
                            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-indigo-300" />
                            </div>
                            <p className="text-xs font-semibold text-white">Compliance</p>
                            <p className="text-[10px] text-indigo-400 mt-0.5">Audit-ready</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8" style={{ background: '#fafbfc' }}>
                <div className="w-full max-w-md">
                    {/* Mobile branding */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Droplets className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Water Supply Management</h1>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                            <p className="text-sm text-gray-500 mt-1.5">Sign in to access the management portal</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        {...register('email', { required: true })}
                                        placeholder="admin@example.com"
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:border-gray-300 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', { required: true })}
                                        placeholder="Enter your password"
                                        className="block w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:border-gray-300 focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    Remember me
                                </label>
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">Register here</Link>
                        </p>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        © 2026 Water Supply Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
