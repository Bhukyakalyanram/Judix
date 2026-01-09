import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data.user);
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.data.user);
    };

    // --- NEW: Update User Function ---
    const updateProfile = async (updatedData) => {
        // updatedData should be an object like { name: 'New Name' }
        const res = await api.patch('/auth/updateMe', updatedData);
        setUser(res.data.data.user); // This updates the UI everywhere automatically
        return res.data;
    };
    const updatePassword = async (passwordData) => {
        // passwordData: { passwordCurrent, password }
        const res = await api.patch('/auth/updatePassword', passwordData);
        localStorage.setItem('token', res.data.token); // Store the new token
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, updatePassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);