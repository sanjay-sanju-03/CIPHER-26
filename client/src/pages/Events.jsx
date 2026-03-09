import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiArrowRight, FiUsers, FiClock, FiMapPin, FiAward, FiImage, FiX, FiZoomIn } from 'react-icons/fi';
import API from '../utils/api';
import './Events.css';

const CATEGORIES = ['All', 'Technical', 'Workshop', 'Non-Technical', 'Gaming', 'Online'];

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        API.get('/events')
            .then(res => setEvents(res.data))
            .catch(() => setEvents(DEMO_EVENTS))
            .finally(() => setLoading(false));
    }, []);

    const filtered = events.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || e.category === category;
        return matchSearch && matchCat;
    });

    const mainEvents = filtered.filter(e => !e.isPreEvent);
    const preEvents = filtered.filter(e => e.isPreEvent);

    return (
        <div className="page-wrapper events-page">
            <div className="grid-bg" />
            <div className="orb orb-1" /><div className="orb orb-2" />

            <div className="container">
                <div className="events-header">
                    <p className="section-subtitle">What's happening?</p>
                    <h1 className="section-title">ALL EVENTS</h1>
                </div>

                {/* Filters */}
                <div className="events-filters">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            id="events-search"
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="category-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`cat-tab ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-screen">
                        <div className="spinner" />
                        <p style={{ color: 'var(--text-secondary)' }}>Loading events...</p>
                    </div>
                ) : (
                    <>
                        {/* Pre-Events */}
                        {preEvents.length > 0 && (
                            <div className="events-section">
                                <div className="events-section-header">
                                    <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '6px 16px' }}>⚡ Pre-Events</span>
                                    <p className="events-section-sub">Happening before the main fest — don't miss out!</p>
                                </div>
                                <div className="events-list">
                                    {preEvents.map(event => <EventCard key={event._id} event={event} />)}
                                </div>
                            </div>
                        )}

                        {/* On-Day Events */}
                        {mainEvents.length > 0 && (
                            <div className="events-section">
                                {preEvents.length > 0 && (
                                    <div className="events-section-header">
                                        <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '6px 16px' }}>🔥 On-Day Events</span>
                                        <p className="events-section-sub">The heart of CIPHER'26</p>
                                    </div>
                                )}
                                <div className="events-list">
                                    {mainEvents.map(event => <EventCard key={event._id} event={event} />)}
                                </div>
                            </div>
                        )}

                        {filtered.length === 0 && (
                            <div className="no-events"><p>No events found matching your criteria.</p></div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Horizontal Event Card ─────────────────────────────────────────────── */
function EventCard({ event }) {
    const categoryColors = {
        Technical: 'green', Workshop: 'purple', 'Non-Technical': 'cyan', Gaming: 'red', Online: 'purple'
    };
    const color = categoryColors[event.category] || 'green';
    const [lightbox, setLightbox] = useState(false);

    const handleKey = useCallback((e) => { if (e.key === 'Escape') setLightbox(false); }, []);
    useEffect(() => {
        if (lightbox) {
            document.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        }
        return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
    }, [lightbox, handleKey]);

    return (
        <>
            {/* Lightbox */}
            {lightbox && event.image && (
                <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
                    <button className="lightbox-close" onClick={() => setLightbox(false)}><FiX size={24} /></button>
                    <img src={event.image} alt={event.title} className="lightbox-img" onClick={e => e.stopPropagation()} />
                    <p className="lightbox-caption">{event.title}</p>
                </div>
            )}

            {/* Card — horizontal */}
            <div className={`event-card event-card-${color}`}>

                {/* LEFT: Poster */}
                <div
                    className={`event-poster-col ${event.image ? 'has-image' : 'no-image'}`}
                    onClick={() => event.image && setLightbox(true)}
                >
                    {event.image ? (
                        <>
                            <img src={event.image} alt={event.title} className="event-poster-img" />
                            <div className="event-poster-dim" />
                            <div className="event-poster-hint"><FiZoomIn size={20} /> View Full Poster</div>
                        </>
                    ) : (
                        <FiImage size={48} className="event-no-img-icon" />
                    )}
                </div>

                {/* RIGHT: Details */}
                <div className="event-details-col">

                    {/* Badges */}
                    <div className="event-badges">
                        <span className={`badge badge-${color}`}>{event.category}</span>
                        {event.isPreEvent && <span className="badge badge-red">⚡ PRE-EVENT</span>}
                        <span className={`badge ${event.mode === 'online' ? 'badge-cyan' : 'badge-purple'}`}>
                            {event.mode === 'online' ? '🌐 Online' : '📍 Offline'}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="event-title">{event.title}</h2>

                    {/* Prize */}
                    {event.prize && (
                        <div className="event-prize">
                            <FiAward size={14} /> {event.prize}
                        </div>
                    )}

                    {/* Full description */}
                    <p className="event-desc">{event.description}</p>

                    {/* Meta info */}
                    <div className="event-meta-grid">
                        {event.date && (
                            <div className="event-meta-item">
                                <span>📅</span><span>{event.date}</span>
                            </div>
                        )}
                        {event.time && (
                            <div className="event-meta-item">
                                <FiClock size={13} /><span>{event.time}</span>
                            </div>
                        )}
                        {event.venue && (
                            <div className="event-meta-item">
                                <FiMapPin size={13} /><span>{event.venue}</span>
                            </div>
                        )}
                        {event.teamSize && (
                            <div className="event-meta-item">
                                <FiUsers size={13} /><span>{event.teamSize}</span>
                            </div>
                        )}
                    </div>

                    {/* Fee + Register */}
                    <div className="event-footer-row">
                        <div className={`event-fee ${event.registrationFee > 0 ? '' : 'event-free'}`}>
                            {event.registrationFee > 0
                                ? `Entry Fee: ₹${event.registrationFee}`
                                : 'Free Entry'}
                        </div>
                        <RegistrationButton event={event} />
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Registration Button — auto status based on deadline ── */
function RegistrationButton({ event }) {
    const now = new Date();
    const deadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
    const isClosed = deadline && now > deadline;

    // Format deadline nicely
    const fmtDeadline = deadline
        ? deadline.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : null;

    if (isClosed) {
        return (
            <span className="btn event-btn event-btn-closed">
                🔒 Registration Closed
            </span>
        );
    }

    if (event.registrationLink) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary event-btn"
                >
                    Register Now <FiArrowRight size={15} />
                </a>
                {fmtDeadline && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--warning)', letterSpacing: '0.5px' }}>
                        ⏳ Closes: {fmtDeadline}
                    </span>
                )}
            </div>
        );
    }

    return (
        <span className="btn event-btn event-btn-soon">
            Registration Link Coming Soon
        </span>
    );
}

// Demo fallback
const DEMO_EVENTS = [
    { _id: '3', title: 'Web Dev Workshop', category: 'Workshop', description: 'Hands-on web development workshop covering React, Node.js, and modern deployment practices. Open to all skill levels.', date: 'March 23', time: '11:00 AM', venue: 'CSE Dept', teamSize: 'Individual', prize: '', registrationFee: 0, mode: 'offline', isPreEvent: false },
    { _id: '4', title: 'Robo Race', category: 'Technical', description: 'Design and race your robot through an obstacle course. Test your engineering and programming skills under pressure.', date: 'March 23', time: '2:00 PM', venue: 'Ground Floor', teamSize: '2-3 members', prize: '₹8000', registrationFee: 150, mode: 'offline', isPreEvent: false },
];
