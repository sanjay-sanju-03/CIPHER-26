import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiCalendar, FiAward } from 'react-icons/fi';
import './BottomNav.css';

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { to: '/', label: 'Home', icon: <FiHome size={24} /> },
        { to: '/events', label: 'Events', icon: <FiGrid size={24} /> },
        { to: '/schedule', label: 'Schedule', icon: <FiCalendar size={24} /> },
        { to: '/certificates', label: 'Certificates', icon: <FiAward size={24} /> },
    ];

    function isActive(to) {
        if (to === '/') return location.pathname === '/';
        return location.pathname.startsWith(to) || (to === '/certificates' && location.pathname === '/verify');
    }

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map(item => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`bottom-nav-item ${isActive(item.to) ? 'active' : ''}`}
                        title={item.label}
                    >
                        <span className="bottom-nav-icon">{item.icon}</span>
                        <span className="bottom-nav-label">{item.label}</span>
                        {isActive(item.to) && <span className="bottom-nav-indicator" />}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
