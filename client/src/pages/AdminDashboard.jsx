import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiCalendar, FiStar, FiLogOut, FiX, FiCheck, FiUpload, FiImage, FiWifi, FiMapPin } from 'react-icons/fi';
import logo from '../assets/cipher-logo.png';
import API from '../utils/api';
import './AdminDashboard.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const TABS = ['Overview', 'Events', 'Registrations', 'Schedule', 'Sponsors'];

// March 1 – 23 (pre-events can be on earlier dates)
const MARCH_DATES = Array.from({ length: 23 }, (_, i) => `March ${i + 1}`);

export default function AdminDashboard() {
    const [tab, setTab] = useState('Overview');
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/admin/login'); return; }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [e, r, sc, sp] = await Promise.all([
                API.get('/events/all'),
                API.get('/registrations'),
                API.get('/schedule'),
                API.get('/sponsors'),
            ]);
            setEvents(e.data);
            setRegistrations(r.data);
            setSchedule(sc.data);
            setSponsors(sp.data);
        } catch (err) {
            if (err.response?.status === 401) navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <img src={logo} alt="CIPHER'26 Logo" className="admin-logo-img" />
                </div>
                <nav className="admin-nav">
                    {TABS.map(t => (
                        <button key={t} className={`admin-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                            {t}
                        </button>
                    ))}
                </nav>
                <button className="admin-logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </div>

            <div className="admin-main">
                <div className="admin-topbar">
                    <h2 className="admin-page-title">{tab}</h2>
                    <span className="admin-badge">Admin Panel</span>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="spinner" /></div>
                ) : (
                    <div className="admin-content">
                        {tab === 'Overview' && <Overview events={events} registrations={registrations} sponsors={sponsors} />}
                        {tab === 'Events' && <EventsAdmin events={events} refresh={fetchAll} apiBase={API_BASE} />}
                        {tab === 'Registrations' && <RegistrationsAdmin registrations={registrations} refresh={fetchAll} />}
                        {tab === 'Schedule' && <ScheduleAdmin schedule={schedule} refresh={fetchAll} />}
                        {tab === 'Sponsors' && <SponsorsAdmin sponsors={sponsors} refresh={fetchAll} />}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ events, registrations, sponsors }) {
    const stats = [
        { label: 'Total Events', value: events.length, icon: <FiCalendar />, color: 'green' },
        { label: 'Registrations', value: registrations.length, icon: <FiUsers />, color: 'cyan' },
        { label: 'Sponsors', value: sponsors.length, icon: <FiStar />, color: 'purple' },
        { label: 'Pending', value: registrations.filter(r => r.status === 'pending').length, icon: <FiUsers />, color: 'warning' },
    ];

    return (
        <div>
            <div className="overview-stats">
                {stats.map((s, i) => (
                    <div key={i} className={`overview-stat stat-${s.color}`}>
                        <div className="overview-stat-icon">{s.icon}</div>
                        <div className="overview-stat-value">{s.value}</div>
                        <div className="overview-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>
            <div className="overview-recent">
                <h3>Recent Registrations</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Name</th><th>Event</th><th>College</th><th>Status</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            {registrations.slice(0, 8).map(r => (
                                <tr key={r._id}>
                                    <td>{r.name}</td>
                                    <td>{r.eventTitle}</td>
                                    <td>{r.college}</td>
                                    <td><StatusBadge status={r.status} /></td>
                                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Events Admin ─────────────────────────────────────────────────────────────
function EventsAdmin({ events, refresh, apiBase }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(defaultEvent());
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all | pre | main

    function defaultEvent() {
        return {
            title: '', description: '', category: 'Technical',
            date: 'March 23', time: '', venue: '',
            teamSize: 'Individual', prize: '', registrationFee: 0,
            maxParticipants: 100, isActive: true,
            mode: 'offline', isPreEvent: false,
            registrationLink: '',
            registrationDeadline: '',
        };
    }

    const openAdd = () => {
        setForm(defaultEvent());
        setEditing(null);
        setImageFile(null);
        setImagePreview('');
        setShowForm(true);
    };

    const openEdit = (e) => {
        setForm(e);
        setEditing(e._id);
        setImageFile(null);
        setImagePreview(e.image ? e.image : '');
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { ...form };
            // Remove internal Mongoose fields that shouldn't be sent
            delete payload._id;
            delete payload.__v;
            delete payload.createdAt;
            delete payload.updatedAt;

            // Convert image file to base64 if a new one was selected
            if (imageFile) {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
                payload.image = base64;
            }

            if (editing) {
                await API.put(`/events/${editing}`, payload);
            } else {
                await API.post('/events', payload);
            }
            setShowForm(false);
            refresh();
        } catch (err) {
            alert('Error saving event: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this event?')) { await API.delete(`/events/${id}`); refresh(); }
    };

    const mainEvents = events.filter(e => !e.isPreEvent);
    const preEvents = events.filter(e => e.isPreEvent);
    const displayEvents = filterType === 'pre' ? preEvents : filterType === 'main' ? mainEvents : events;

    return (
        <div>
            <div className="admin-section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <h3>Events ({events.length})</h3>
                    <div className="filter-tabs">
                        <button className={`cat-tab ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All ({events.length})</button>
                        <button className={`cat-tab ${filterType === 'main' ? 'active' : ''}`} onClick={() => setFilterType('main')}>Main ({mainEvents.length})</button>
                        <button className={`cat-tab ${filterType === 'pre' ? 'active' : ''}`} onClick={() => setFilterType('pre')}>Pre-Events ({preEvents.length})</button>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Event</button>
            </div>

            {showForm && (
                <div className="admin-form-card">
                    <div className="admin-form-header">
                        <h4>{editing ? 'Edit Event' : 'New Event'}</h4>
                        <button className="icon-btn" onClick={() => setShowForm(false)}><FiX /></button>
                    </div>

                    <div className="admin-form-grid">
                        <FormField label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
                        <FormField label="Category" type="select" options={['Technical', 'Workshop', 'Non-Technical', 'Gaming', 'Online']} value={form.category} onChange={v => setForm({ ...form, category: v })} />
                        <FormField label="Date" type="select" options={MARCH_DATES} value={form.date} onChange={v => setForm({ ...form, date: v })} />
                        <FormField label="Time" placeholder="e.g. 10:00 AM" value={form.time} onChange={v => setForm({ ...form, time: v })} />
                        <FormField label="Venue" value={form.venue} onChange={v => setForm({ ...form, venue: v })} />
                        <FormField label="Team Size" placeholder="e.g. Individual / 2-4 members" value={form.teamSize} onChange={v => setForm({ ...form, teamSize: v })} />
                        <FormField label="Prize" placeholder="e.g. ₹5000" value={form.prize} onChange={v => setForm({ ...form, prize: v })} />
                        <FormField label="Fee (₹)" type="number" value={form.registrationFee} onChange={v => setForm({ ...form, registrationFee: v })} />
                        <FormField label="Max Participants" type="number" value={form.maxParticipants} onChange={v => setForm({ ...form, maxParticipants: v })} />

                        {/* Mode */}
                        <div className="form-group">
                            <label>Mode</label>
                            <div className="mode-toggle">
                                <button
                                    type="button"
                                    className={`mode-btn ${form.mode === 'offline' ? 'active-offline' : ''}`}
                                    onClick={() => setForm({ ...form, mode: 'offline' })}
                                >
                                    <FiMapPin size={14} /> Offline
                                </button>
                                <button
                                    type="button"
                                    className={`mode-btn ${form.mode === 'online' ? 'active-online' : ''}`}
                                    onClick={() => setForm({ ...form, mode: 'online' })}
                                >
                                    <FiWifi size={14} /> Online
                                </button>
                            </div>
                        </div>

                        {/* Pre-event toggle */}
                        <div className="form-group">
                            <label>Event Type</label>
                            <div className="mode-toggle">
                                <button
                                    type="button"
                                    className={`mode-btn ${!form.isPreEvent ? 'active-offline' : ''}`}
                                    onClick={() => setForm({ ...form, isPreEvent: false })}
                                >
                                    On-Day Event
                                </button>
                                <button
                                    type="button"
                                    className={`mode-btn ${form.isPreEvent ? 'active-online' : ''}`}
                                    onClick={() => setForm({ ...form, isPreEvent: true })}
                                >
                                    Pre-Event
                                </button>
                            </div>
                        </div>

                        {/* Active toggle */}
                        <div className="form-group">
                            <label>Status</label>
                            <div className="mode-toggle">
                                <button type="button" className={`mode-btn ${form.isActive ? 'active-offline' : ''}`} onClick={() => setForm({ ...form, isActive: true })}>Active</button>
                                <button type="button" className={`mode-btn ${!form.isActive ? 'active-online' : ''}`} onClick={() => setForm({ ...form, isActive: false })}>Inactive</button>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>Description</label>
                        <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>

                    {/* Registration Link */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>Registration Link (Google Form URL)</label>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="https://forms.gle/your-google-form-link"
                            value={form.registrationLink}
                            onChange={e => setForm({ ...form, registrationLink: e.target.value })}
                        />
                    </div>

                    {/* Registration Deadline */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔒 Registration Closes On
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                                (after this date &amp; time, Register button shows "Registration Closed")
                            </span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={form.registrationDeadline || ''}
                            onChange={e => setForm({ ...form, registrationDeadline: e.target.value })}
                        />
                        {form.registrationDeadline && (
                            <button
                                type="button"
                                style={{ marginTop: '6px', fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}
                                onClick={() => setForm({ ...form, registrationDeadline: '' })}
                            >
                                ✕ Clear deadline
                            </button>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>Event Poster / Image</label>
                        <div className="image-upload-area">
                            <input
                                id="event-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {imagePreview ? (
                                <div className="image-preview-wrap">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button type="button" className="image-remove-btn" onClick={() => { setImageFile(null); setImagePreview(''); }}>
                                        <FiX /> Remove
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="event-image-upload" className="image-upload-label">
                                    <FiUpload size={28} />
                                    <span>Click to upload poster</span>
                                    <span className="image-hint">JPG, PNG, WEBP — Max 5MB</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="admin-form-actions">
                        <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : <><FiCheck /> Save Event</>}
                        </button>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Poster</th><th>Title</th><th>Category</th><th>Mode</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {displayEvents.map(e => (
                            <tr key={e._id}>
                                <td>
                                    {e.image ? (
                                        <img src={e.image} alt={e.title} className="table-thumbnail" />
                                    ) : (
                                        <div className="table-no-img"><FiImage /></div>
                                    )}
                                </td>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.title}</td>
                                <td><span className="badge badge-green">{e.category}</span></td>
                                <td>
                                    <span className={`badge ${e.mode === 'online' ? 'badge-cyan' : 'badge-purple'}`}>
                                        {e.mode === 'online' ? '🌐 Online' : '📍 Offline'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${e.isPreEvent ? 'badge-red' : 'badge-green'}`}>
                                        {e.isPreEvent ? 'Pre-Event' : 'Main'}
                                    </span>
                                </td>
                                <td>{e.date}</td>
                                <td>{e.time}</td>
                                <td><span className={`badge ${e.isActive ? 'badge-green' : 'badge-red'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn text-cyan" onClick={() => openEdit(e)}><FiEdit2 /></button>
                                        <button className="icon-btn text-red" onClick={() => handleDelete(e._id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Registrations Admin ──────────────────────────────────────────────────────
function RegistrationsAdmin({ registrations, refresh }) {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter);

    const updateStatus = async (id, status) => {
        await API.put(`/registrations/${id}`, { status });
        refresh();
    };

    const deleteReg = async (id) => {
        if (window.confirm('Delete registration?')) { await API.delete(`/registrations/${id}`); refresh(); }
    };

    return (
        <div>
            <div className="admin-section-header">
                <h3>All Registrations ({registrations.length})</h3>
                <div className="filter-tabs">
                    {['all', 'pending', 'confirmed', 'rejected'].map(f => (
                        <button key={f} className={`cat-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead><tr><th>Name</th><th>Event</th><th>Email</th><th>College</th><th>Year</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r._id}>
                                <td>{r.name}</td>
                                <td>{r.eventTitle}</td>
                                <td>{r.email}</td>
                                <td>{r.college}</td>
                                <td>{r.year}</td>
                                <td>
                                    <select value={r.status} onChange={e => updateStatus(r._id, e.target.value)} className="status-select">
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="icon-btn text-red" onClick={() => deleteReg(r._id)}><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Schedule Admin ───────────────────────────────────────────────────────────
function ScheduleAdmin({ schedule, refresh }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultSched());

    function defaultSched() {
        return { title: '', description: '', date: 'March 23', time: '', venue: '', type: 'event', order: 0 };
    }

    const handleSave = async () => {
        await API.post('/schedule', form);
        setShowForm(false);
        refresh();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete schedule item?')) { await API.delete(`/schedule/${id}`); refresh(); }
    };

    return (
        <div>
            <div className="admin-section-header">
                <h3>Schedule ({schedule.length} items)</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> Add Item</button>
            </div>
            {showForm && (
                <div className="admin-form-card">
                    <div className="admin-form-grid">
                        <FormField label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
                        <FormField label="Type" type="select" options={['event', 'ceremony', 'workshop', 'break']} value={form.type} onChange={v => setForm({ ...form, type: v })} />
                        <FormField label="Date" type="select" options={MARCH_DATES} value={form.date} onChange={v => setForm({ ...form, date: v })} />
                        <FormField label="Time" placeholder="e.g. 10:00 AM" value={form.time} onChange={v => setForm({ ...form, time: v })} />
                        <FormField label="Venue" value={form.venue} onChange={v => setForm({ ...form, venue: v })} />
                        <FormField label="Order" type="number" value={form.order} onChange={v => setForm({ ...form, order: v })} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="admin-form-actions">
                        <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}><FiCheck /> Save</button>
                    </div>
                </div>
            )}
            <div className="table-wrapper">
                <table>
                    <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Time</th><th>Venue</th><th>Actions</th></tr></thead>
                    <tbody>
                        {schedule.map(s => (
                            <tr key={s._id}>
                                <td>{s.title}</td>
                                <td><span className="badge badge-cyan">{s.type}</span></td>
                                <td>{s.date}</td>
                                <td>{s.time}</td>
                                <td>{s.venue}</td>
                                <td><button className="icon-btn text-red" onClick={() => handleDelete(s._id)}><FiTrash2 /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Sponsors Admin ───────────────────────────────────────────────────────────
function SponsorsAdmin({ sponsors, refresh }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', website: '', tier: 'silver' });

    const handleSave = async () => {
        await API.post('/sponsors', form);
        setShowForm(false);
        refresh();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete sponsor?')) { await API.delete(`/sponsors/${id}`); refresh(); }
    };

    return (
        <div>
            <div className="admin-section-header">
                <h3>Sponsors ({sponsors.length})</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> Add Sponsor</button>
            </div>
            {showForm && (
                <div className="admin-form-card">
                    <div className="admin-form-grid">
                        <FormField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                        <FormField label="Website" placeholder="https://..." value={form.website} onChange={v => setForm({ ...form, website: v })} />
                        <FormField label="Tier" type="select" options={['platinum', 'gold', 'silver', 'bronze']} value={form.tier} onChange={v => setForm({ ...form, tier: v })} />
                    </div>
                    <div className="admin-form-actions">
                        <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}><FiCheck /> Save</button>
                    </div>
                </div>
            )}
            <div className="table-wrapper">
                <table>
                    <thead><tr><th>Name</th><th>Tier</th><th>Website</th><th>Actions</th></tr></thead>
                    <tbody>
                        {sponsors.map(s => (
                            <tr key={s._id}>
                                <td>{s.name}</td>
                                <td><span className="badge badge-purple">{s.tier}</span></td>
                                <td><a href={s.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{s.website}</a></td>
                                <td><button className="icon-btn text-red" onClick={() => handleDelete(s._id)}><FiTrash2 /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FormField({ label, type = 'text', value, onChange, options, placeholder }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            {type === 'select' ? (
                <select className="form-control" value={value} onChange={e => onChange(e.target.value)}>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <input type={type} className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const map = { pending: 'badge-cyan', confirmed: 'badge-green', rejected: 'badge-red' };
    return <span className={`badge ${map[status] || 'badge-cyan'}`}>{status}</span>;
}
