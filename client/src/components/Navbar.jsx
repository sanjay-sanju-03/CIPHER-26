import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
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

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/events', label: 'Events' },
        { to: '/schedule', label: 'Schedule' },
        { to: '/certificates', label: 'Certificates' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="CIPHER'26 Logo" className="logo-img" />
                    <div className="logo-text">
                        <span className="logo-cipher">CIPHER</span>
                        <span className="logo-year">'26</span>
                    </div>
                </Link>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>
        </nav>
    );
}
