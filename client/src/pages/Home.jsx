import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCode, FiCpu, FiZap, FiUsers, FiAward } from 'react-icons/fi';
import logo from '../assets/cipher-logo.png';
import Countdown from '../components/Countdown';
import './Home.css';

const stats = [
    { icon: <FiUsers />, value: '300+', label: 'Participants' },
    { icon: <FiCode />, value: '10+', label: 'Events' },
    { icon: <FiAward />, value: '₹20K+', label: 'Prize Pool' },
    { icon: <FiCpu />, value: '1', label: 'Day' },
];

const highlights = [
    {
        icon: <FiCode size={28} />,
        title: 'Technical Events',
        desc: 'Competitive programming, hackathons, project expos, and more.',
        color: 'green',
    },
    {
        icon: <FiCpu size={28} />,
        title: 'Workshops',
        desc: 'Hands-on sessions with industry experts on cutting-edge tech.',
        color: 'purple',
    },
    {
        icon: <FiZap size={28} />,
        title: 'Non-Technical',
        desc: 'Gaming, treasure hunt, photography, and fun cultural events.',
        color: 'cyan',
    },
];

export default function Home() {
    const heroRef = useRef(null);

    useEffect(() => {
        // Particle effect
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1,
        }));

        let animId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            animId = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="home">
            {/* Particles */}
            <canvas id="particles-canvas" className="particles-canvas" />

            {/* Hero */}
            <section className="hero" ref={heroRef}>
                <div className="hero-content container">
                    <div className="hero-logo-wrap">
                        <img src={logo} alt="CIPHER'26 Logo" className="hero-logo" />
                    </div>

                    <div className="hero-title-wrap">
                        <div className="hero-glitch-text">CIPHER</div>
                        <div className="hero-year">'26</div>
                    </div>

                    <p className="hero-tagline">
                        Decode the Future. <span className="highlight">Rewrite Reality.</span>
                    </p>
                    <p className="hero-date">📅 March 23, 2026  &nbsp;|&nbsp; LBS College of Engineering</p>

                    <Countdown />

                    <div className="hero-actions">
                        <Link to="/events" className="btn btn-primary btn-lg">
                            Explore Events <FiArrowRight />
                        </Link>
                        <Link to="/schedule" className="btn btn-secondary btn-lg">
                            View Schedule
                        </Link>
                    </div>
                </div>

                <div className="hero-scroll-indicator">
                    <div className="scroll-arrow" />
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-icon">{s.icon}</div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="about-section">
                <div className="container">
                    <p className="section-subtitle">What is CIPHER?</p>
                    <h2 className="section-title">ABOUT THE FEST</h2>

                    {/* 3 cards — horizontal row */}
                    <div className="about-cards-row">
                        <div className="about-block about-block-green">
                            <span className="about-block-tag">🏛️ The Institution</span>
                            <p>
                                <strong>LBS College of Engineering, Kasaragod</strong>, established in 1993
                                under the LBS Centre for Science and Technology, Thiruvananthapuram, stands
                                as a hub of academic excellence, innovation, and technological advancement —
                                consistently nurturing skilled engineers through quality education, research,
                                and a strong culture of creativity.
                            </p>
                        </div>

                        <div className="about-block about-block-purple">
                            <span className="about-block-tag">💡 The Association</span>
                            <p>
                                The <strong>Association of Information Technology (IT)</strong> actively
                                drives technical initiatives and innovation among students, creating
                                opportunities for learning, collaboration, and practical exposure to
                                emerging technologies.
                            </p>
                        </div>

                        <div className="about-block about-block-cyan">
                            <span className="about-block-tag">🚀 The Fest</span>
                            <p>
                                <strong>CIPHER</strong> is the annual flagship <strong>Techno-Cultural Fest</strong> —
                                a dynamic platform for technology, competitions, workshops, and innovation.
                            </p>
                        </div>
                    </div>

                    {/* 6 hex tags — horizontal row below */}
                    <div className="about-hex-row">
                        {['AI', 'ML', 'WEB', 'IoT', 'CODE', 'HACK'].map((t, i) => (
                            <div key={i} className="hex-item">{t}</div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/events" className="btn btn-primary btn-lg">
                            See All Events <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="highlights-section">
                <div className="container">
                    <p className="section-subtitle">What We Offer</p>
                    <h2 className="section-title">EVENT HIGHLIGHTS</h2>
                    <div className="highlights-grid">
                        {highlights.map((h, i) => (
                            <div key={i} className={`highlight-card highlight-${h.color}`}>
                                <div className="highlight-icon">{h.icon}</div>
                                <h3>{h.title}</h3>
                                <p>{h.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-glow" />
                        <h2>Ready to Compete?</h2>
                        <p>Register for your favorite events and showcase your talent on the national stage.</p>
                        <Link to="/events" className="btn btn-primary btn-lg">
                            Register Now <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
