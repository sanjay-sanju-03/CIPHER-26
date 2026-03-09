import { useState, useEffect } from 'react';
import { FiClock, FiMapPin } from 'react-icons/fi';
import API from '../utils/api';
import './Schedule.css';

const TYPE_COLORS = { event: 'green', ceremony: 'purple', workshop: 'cyan', break: 'muted' };

export default function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/schedule')
            .then(res => setSchedule(res.data || []))
            .catch(() => setSchedule([]))
            .finally(() => setLoading(false));
    }, []);

    const sortedSchedule = [...schedule].sort((a, b) => a.order - b.order);

    return (
        <div className="page-wrapper schedule-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container">
                <p className="section-subtitle">Plan Your Day</p>
                <h1 className="section-title">EVENT SCHEDULE</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                    📅 March 23, 2026 &nbsp;|&nbsp; LBS College of Engineering, Kasaragod
                </p>

                {loading ? (
                    <div className="loading-screen"><div className="spinner" /></div>
                ) : sortedSchedule.length > 0 ? (
                    <div className="timeline">
                        {sortedSchedule.map((item) => (
                            <div key={item._id} className={`timeline-item timeline-${TYPE_COLORS[item.type]}`}>
                                <div className="timeline-dot" />
                                <div className="timeline-content">
                                    <div className="timeline-time"><FiClock size={12} /> {item.time}</div>
                                    <div className="timeline-card">
                                        <div className="timeline-header">
                                            <h3 className="timeline-title">{item.title}</h3>
                                            <span className={`badge badge-${TYPE_COLORS[item.type] === 'muted' ? 'cyan' : TYPE_COLORS[item.type]}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                        {item.description && <p className="timeline-desc">{item.description}</p>}
                                        {item.venue && (
                                            <div className="timeline-venue"><FiMapPin size={12} /> {item.venue}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ComingSoon />
                )}
            </div>
        </div>
    );
}

/* ── Clean Coming Soon ── */
function ComingSoon() {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const TARGET = new Date('2026-03-23T09:00:00');

    useEffect(() => {
        const tick = () => {
            const diff = TARGET - new Date();
            if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setTimeLeft({
                d: Math.floor(diff / 864e5),
                h: Math.floor((diff % 864e5) / 36e5),
                m: Math.floor((diff % 36e5) / 6e4),
                s: Math.floor((diff % 6e4) / 1e3),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const pad = n => String(n ?? 0).padStart(2, '0');

    return (
        <div className="cs-wrapper">
            <div className="cs-content">

                {/* Icon */}
                <div className="cs-icon-wrap">
                    <FiClock size={28} className="cs-icon" />
                </div>

                {/* Heading */}
                <h2 className="cs-heading">Schedule Coming Soon</h2>
                <p className="cs-sub">
                    The full event schedule for <strong>CIPHER'26</strong> will be published closer to the fest.
                    Check back soon — it's going to be a packed day!
                </p>

                {/* Countdown */}
                <div className="cs-countdown">
                    {[['Days', timeLeft.d], ['Hrs', timeLeft.h], ['Min', timeLeft.m], ['Sec', timeLeft.s]].map(([label, val]) => (
                        <div key={label} className="cs-unit">
                            <span className="cs-num">{pad(val)}</span>
                            <span className="cs-label">{label}</span>
                        </div>
                    ))}
                </div>

                <p className="cs-until">
                    📅 March 23, 2026 &nbsp;·&nbsp; LBS College of Engineering, Kasaragod
                </p>

            </div>
        </div>
    );
}
