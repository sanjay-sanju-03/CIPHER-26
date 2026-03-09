import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import API from '../utils/api';
import './AdminLogin.css';

export default function AdminLogin() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/login', form);
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper admin-login-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">
                            <FiLock size={32} />
                        </div>
                        <h1 className="login-title">ADMIN ACCESS</h1>
                        <p className="login-sub">CIPHER'26 Control Panel</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="admin-username">Username</label>
                            <div className="input-icon-wrap">
                                <FiUser className="input-icon" />
                                <input
                                    id="admin-username"
                                    type="text"
                                    className="form-control input-with-icon"
                                    placeholder="Admin username"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="admin-password">Password</label>
                            <div className="input-icon-wrap">
                                <FiLock className="input-icon" />
                                <input
                                    id="admin-password"
                                    type={showPass ? 'text' : 'password'}
                                    className="form-control input-with-icon"
                                    placeholder="Admin password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    autoComplete="current-password"
                                />
                                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>
                        <button id="admin-login-btn" type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login to Dashboard'}
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}
