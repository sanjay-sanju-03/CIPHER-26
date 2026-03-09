import { useState, useEffect } from 'react';
import './Countdown.css';

const TARGET_DATE = new Date('2026-03-23T09:00:00');

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    function getTimeLeft() {
        const diff = TARGET_DATE - new Date();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    const units = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
    ];

    return (
        <div className="countdown-wrapper">
            <p className="countdown-label">EVENT STARTS IN</p>
            <div className="countdown-grid">
                {units.map(({ label, value }) => (
                    <div key={label} className="countdown-unit">
                        <div className="countdown-box">
                            <span className="countdown-value">{String(value).padStart(2, '0')}</span>
                            <div className="countdown-shine" />
                        </div>
                        <span className="countdown-unit-label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
