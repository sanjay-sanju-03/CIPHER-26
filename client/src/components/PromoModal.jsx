import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiArrowRight, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../utils/api';
import './PromoModal.css';

export default function PromoModal() {
    const [show, setShow] = useState(false);
    const [events, setEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const hasSeen = sessionStorage.getItem('cipher_promo_seen');
        if (!hasSeen) {
            API.get('/events')
                .then(res => {
                    const posters = res.data.filter(e => e.image && !e.isPreEvent);
                    setEvents(posters);
                    const timer = setTimeout(() => setShow(true), 1500);
                    return () => clearTimeout(timer);
                })
                .catch(() => {
                    const timer = setTimeout(() => setShow(true), 1500);
                    return () => clearTimeout(timer);
                });
        }
    }, []);

    // Auto-advance the slider every 3.5 seconds
    useEffect(() => {
        if (!show || events.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % events.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [show, events.length]);

    const close = () => {
        setShow(false);
        sessionStorage.setItem('cipher_promo_seen', 'true');
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        setActiveIndex(prev => (prev + 1) % events.length);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setActiveIndex(prev => (prev === 0 ? events.length - 1 : prev - 1));
    };

    if (!show) return null;

    const currentEvent = events.length > 0 ? events[activeIndex] : null;

    return (
        <div className="promo-overlay2" onClick={close}>
            <div className={`promo-cinematic ${events.length > 0 ? 'has-poster' : ''}`} onClick={e => e.stopPropagation()}>
                
                {/* Close Button */}
                <button className="promo-close2" onClick={close} title="Close">
                    <FiX size={24} />
                </button>
                
                {events.length > 0 ? (
                    <>
                        {/* Cinematic Blurred Background */}
                        <div 
                            className="cinematic-bg" 
                            style={{ backgroundImage: `url(${currentEvent.image})` }} 
                        />
                        <div className="cinematic-overlay-dark" />

                        {/* Foreground Content */}
                        <div className="cinematic-content">
                            <div className="cinematic-header">
                                <span className="cyber-badge">⭐ FEATURED HIGHLIGHTS</span>
                            </div>

                            <div className="cinematic-slider">
                                {events.length > 1 && (
                                    <button className="slider-btn prev" onClick={prevSlide}><FiChevronLeft size={28} /></button>
                                )}
                                
                                <div className="cinematic-poster-wrap">
                                    {/* Using the key prop forces React to remount the image, triggering the animation again on change */}
                                    <img src={currentEvent.image} alt={currentEvent.title} className="cinematic-poster" key={currentEvent._id || activeIndex} />
                                    <div className="poster-glow" style={{ backgroundImage: `url(${currentEvent.image})` }} />
                                </div>

                                {events.length > 1 && (
                                    <button className="slider-btn next" onClick={nextSlide}><FiChevronRight size={28} /></button>
                                )}
                            </div>

                            <div className="cinematic-footer">
                                <h3>{currentEvent.title}</h3>
                                <Link to="/events" className="btn btn-primary cinematic-btn" onClick={close}>
                                    Register Now <FiArrowRight />
                                </Link>
                                <div className="slider-dots">
                                    {events.map((_, i) => (
                                        <span key={i} className={`dot ${i === activeIndex ? 'active' : ''}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // Fallback Simple Modal if no posters available
                    <div className="promo-fallback">
                        <div className="promo-banner">
                            <FiImage size={48} className="promo-icon" />
                        </div>
                        <div className="promo-content">
                            <span className="cyber-badge">🔥 REGISTRATIONS LIVE!</span>
                            <h2 style={{ fontFamily: 'Orbitron', margin: '16px 0', fontSize: '1.5rem' }}>ON-DAY EVENTS</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                                The ultimate tech showdown is here! Secure your spot for our massive On-Day Events featuring competitive programming, project expos, hackathons, and extreme non-tech fun!
                            </p>
                            <Link to="/events" className="btn btn-primary cinematic-btn" onClick={close}>
                                Register Now <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
