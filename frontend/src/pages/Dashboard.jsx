import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    Plus, Trash2, LogOut, Search, Filter,
    CheckCircle, Circle, Edit3, Check, X,
    ShieldCheck, User, ChevronDown, LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { user, logout, updateProfile, updatePassword } = useAuth();

    // --- UI States ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'name' or 'password'
    const dropdownRef = useRef(null);

    // --- Task States ---
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // --- Form States ---
    const [tempName, setTempName] = useState(user?.name || '');
    const [passwords, setPasswords] = useState({ current: '', next: '' });

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks?search=${search}&status=${statusFilter}`);
            setTasks(res.data.data.tasks);
        } catch (err) {
            toast.error('Session expired or server error');
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchTasks, 300);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    // --- Logic Handlers ---
    const handleUpdateName = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ name: tempName });
            setActiveModal(null);
            toast.success('Name updated!');
        } catch (err) { toast.error('Update failed'); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await updatePassword({ passwordCurrent: passwords.current, password: passwords.next });
            setActiveModal(null);
            setPasswords({ current: '', next: '' });
            toast.success('Password updated!');
        } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await api.post('/tasks', { title: newTaskTitle });
            setNewTaskTitle('');
            fetchTasks();
            toast.success('Task added');
        } catch (err) { toast.error('Failed to add task'); }
    };

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await api.patch(`/tasks/${task._id}`, { status: newStatus });
            fetchTasks();
        } catch (err) { toast.error('Update failed'); }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-indigo-600 tracking-tight">JUDIX<span className="text-indigo-600">.</span></h1>
                </div>

                {/* Profile Dropdown Container */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                    >
                        <div className="h-9 w-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.name}</span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <button onClick={() => { setActiveModal('name'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                <User size={16} /> Edit Profile Name
                            </button>
                            <button onClick={() => { setActiveModal('password'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                <ShieldCheck size={16} /> Change Password
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-4xl mx-auto py-12 px-6">
                <header className="mb-10 text-center sm:text-left">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Today's Focus</h2>
                    <p className="text-slate-500 mt-1">Manage your tasks and keep track of your progress.</p>
                </header>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Search tasks..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            className="pl-10 pr-8 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm outline-none focus:border-indigo-500 appearance-none font-medium text-slate-600 text-sm min-w-[140px]"
                            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Add Task Input */}
                <form onSubmit={addTask} className="relative mb-10">
                    <input
                        className="w-full pl-6 pr-32 py-4 bg-indigo-600 text-white placeholder-indigo-200 rounded-2xl shadow-lg shadow-indigo-200/50 outline-none focus:ring-4 ring-indigo-600/20 transition-all font-medium"
                        placeholder="Add a new task..."
                        value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button className="absolute right-2 top-2 bottom-2 bg-white text-indigo-600 px-5 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                        <Plus size={18} /> Add
                    </button>
                </form>

                {/* Tasks List */}
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task._id} className="group bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-100 transition-all animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleStatus(task)}
                                    className={`transition-all duration-300 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                                >
                                    {task.status === 'completed' ? <CheckCircle size={26} fill="currentColor" className="text-white fill-emerald-500" /> : <Circle size={26} />}
                                </button>
                                <span className={`text-base font-semibold transition-all ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                    {task.title}
                                </span>
                            </div>
                            <button onClick={() => api.delete(`/tasks/${task._id}`).then(fetchTasks)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-medium">Clear as a whistle! No tasks found.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* --- Modals --- */}
            {activeModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800">
                                {activeModal === 'name' ? 'Update Name' : 'Security Settings'}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>

                        {activeModal === 'name' ? (
                            <form onSubmit={handleUpdateName} className="space-y-4">
                                <input
                                    className="w-full p-3.5 bg-slate-50 border rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none"
                                    value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Full Name"
                                />
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all">Save Changes</button>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <input
                                    type="password" placeholder="Current Password" required
                                    className="w-full p-3.5 bg-slate-50 border rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none"
                                    value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                                <input
                                    type="password" placeholder="New Password" required
                                    className="w-full p-3.5 bg-slate-50 border rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none"
                                    value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                                />
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all">Update Password</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}