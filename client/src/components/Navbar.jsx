import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiCalendar, FiGrid, FiAward } from 'react-icons/fi';
import logo from '../assets/cipher-logo.png';
import './Navbar.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const navLinks = [
        { to: '/', label: 'Home', icon: <FiHome size={20} /> },
        { to: '/events', label: 'Events', icon: <FiGrid size={20} /> },
        { to: '/schedule', label: 'Schedule', icon: <FiCalendar size={20} /> },
        { to: '/certificates', label: 'Certificates', icon: <FiAward size={20} /> },
    ];

    function isActive(to) {
        if (to === '/') return location.pathname === '/';
        return location.pathname.startsWith(to) || (to === '/certificates' && location.pathname === '/verify');
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <img src={logo} alt="CIPHER'26 Logo" className="logo-img" />
                    <div className="logo-text">
                        <span className="logo-cipher">CIPHER</span>
                        <span className="logo-year">'26</span>
                    </div>
                </Link>

                {/* Desktop links */}
                <div className="nav-links-desktop">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile fullscreen menu */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`mobile-link ${isActive(link.to) ? 'active' : ''}`}
                            style={{ animationDelay: isOpen ? `${i * 0.08}s` : '0s' }}
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="mobile-link-icon">{link.icon}</span>
                            <span className="mobile-link-label">{link.label}</span>
                            {isActive(link.to) && <span className="mobile-active-dot" />}
                        </Link>
                    ))}
                </div>
                <div className="mobile-menu-footer">
                    <img src={logo} alt="" className="mobile-footer-logo" />
                    <p>CIPHER'26 — Technical Symposium</p>
                </div>
            </div>
        </nav>
    );
}
