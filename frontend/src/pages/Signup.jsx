import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Validation Schema
const signupSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        try {
            await api.post('/auth/signup', data);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="mt-2 text-slate-500">Join the Judix task manager today</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <input
                                {...register('name')}
                                placeholder="John Doe"
                                className="mt-1 block w-full px-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <input
                                {...register('email')}
                                placeholder="john@example.com"
                                className="mt-1 block w-full px-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="••••••••"
                                className="mt-1 block w-full px-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;