import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import API from '../utils/api';
import './Register.css';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];

export default function Register() {
    const { eventId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventTitle = searchParams.get('title') || 'Event';

    const [form, setForm] = useState({
        name: '', email: '', phone: '', college: '',
        department: '', year: '', teamName: '', teamMembers: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/registrations', {
                ...form,
                eventId,
                eventTitle,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-wrapper register-page">
                <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
                <div className="container success-container">
                    <div className="success-card">
                        <div className="success-icon-wrap">
                            <FiCheckCircle size={60} />
                        </div>
                        <h2>Registration Successful!</h2>
                        <p>You have successfully registered for <strong>{eventTitle}</strong>.</p>
                        <p className="success-sub">We will contact you at <strong>{form.email}</strong> with further details.</p>
                        <div className="success-actions">
                            <button className="btn btn-primary" onClick={() => navigate('/events')}>
                                <FiArrowLeft /> Browse More Events
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper register-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container">
                <button className="btn btn-secondary back-btn" onClick={() => navigate('/events')}>
                    <FiArrowLeft /> Back to Events
                </button>

                <div className="register-layout">
                    <div className="register-info">
                        <div className="register-event-title">
                            <span className="badge badge-green">Registering For</span>
                            <h1>{eventTitle}</h1>
                        </div>
                        <div className="register-steps">
                            <div className="step active">
                                <div className="step-num">1</div>
                                <div className="step-text">Fill in your details</div>
                            </div>
                            <div className="step">
                                <div className="step-num">2</div>
                                <div className="step-text">Get confirmation email</div>
                            </div>
                            <div className="step">
                                <div className="step-num">3</div>
                                <div className="step-text">Participate & win!</div>
                            </div>
                        </div>
                        <div className="register-note">
                            <p>⚡ No account needed — just fill the form and you're in!</p>
                            <p>📩 A confirmation will be shared via email.</p>
                        </div>
                    </div>

                    <div className="register-form-card">
                        <h2 className="form-title">Registration Form</h2>
                        {error && <div className="error-msg">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="reg-name">Full Name *</label>
                                    <input id="reg-name" name="name" type="text" className="form-control" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reg-email">Email *</label>
                                    <input id="reg-email" name="email" type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="reg-phone">Phone *</label>
                                    <input id="reg-phone" name="phone" type="tel" className="form-control" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reg-college">College *</label>
                                    <input id="reg-college" name="college" type="text" className="form-control" placeholder="College name" value={form.college} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="reg-dept">Department *</label>
                                    <select id="reg-dept" name="department" className="form-control" value={form.department} onChange={handleChange} required>
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reg-year">Year *</label>
                                    <select id="reg-year" name="year" className="form-control" value={form.year} onChange={handleChange} required>
                                        <option value="">Select Year</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-team">Team Name (if applicable)</label>
                                <input id="reg-team" name="teamName" type="text" className="form-control" placeholder="Leave blank if individual" value={form.teamName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-members">Team Members (names & emails)</label>
                                <textarea id="reg-members" name="teamMembers" className="form-control" placeholder="E.g. John (john@email.com), Jane (jane@email.com)" value={form.teamMembers} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
                            </div>
                            <button id="register-submit" type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                                {loading ? 'Registering...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
