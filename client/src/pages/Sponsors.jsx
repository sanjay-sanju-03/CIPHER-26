import { useState, useEffect } from 'react';
import API from '../utils/api';
import './Sponsors.css';

const DEMO_SPONSORS = [
    { _id: '1', name: 'TechCorp India', tier: 'platinum', website: '#' },
    { _id: '2', name: 'InnovateHub', tier: 'platinum', website: '#' },
    { _id: '3', name: 'CodeNation', tier: 'gold', website: '#' },
    { _id: '4', name: 'ByteWorks', tier: 'gold', website: '#' },
    { _id: '5', name: 'StartupXcel', tier: 'gold', website: '#' },
    { _id: '6', name: 'DevCraft', tier: 'silver', website: '#' },
    { _id: '7', name: 'NexaCloud', tier: 'silver', website: '#' },
    { _id: '8', name: 'PixelForge', tier: 'silver', website: '#' },
    { _id: '9', name: 'TechPilot', tier: 'bronze', website: '#' },
    { _id: '10', name: 'CodeBase', tier: 'bronze', website: '#' },
];

const TIER_CONFIG = {
    platinum: { label: 'Platinum Sponsors', color: '#e5e4e2', glow: '0 0 20px rgba(229,228,226,0.3)', size: 'xl' },
    gold: { label: 'Gold Sponsors', color: '#FFD700', glow: '0 0 20px rgba(255,215,0,0.3)', size: 'lg' },
    silver: { label: 'Silver Sponsors', color: '#C0C0C0', glow: '0 0 20px rgba(192,192,192,0.3)', size: 'md' },
    bronze: { label: 'Bronze Sponsors', color: '#CD7F32', glow: '0 0 20px rgba(205,127,50,0.3)', size: 'sm' },
};

export default function Sponsors() {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/sponsors')
            .then(res => setSponsors(res.data.length ? res.data : DEMO_SPONSORS))
            .catch(() => setSponsors(DEMO_SPONSORS))
            .finally(() => setLoading(false));
    }, []);

    const grouped = Object.fromEntries(
        ['platinum', 'gold', 'silver', 'bronze'].map(tier => [
            tier, sponsors.filter(s => s.tier === tier)
        ])
    );

    return (
        <div className="page-wrapper sponsors-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container">
                <p className="section-subtitle">Our Proud Partners</p>
                <h1 className="section-title">SPONSORS & PARTNERS</h1>
                <p className="sponsors-intro">
                    CIPHER'26 is proudly supported by these amazing organizations who believe in the power of technology and student innovation.
                </p>

                {loading ? (
                    <div className="loading-screen"><div className="spinner" /></div>
                ) : (
                    <div className="sponsors-tiers">
                        {Object.entries(TIER_CONFIG).map(([tier, config]) => (
                            grouped[tier]?.length > 0 && (
                                <div key={tier} className="tier-section">
                                    <div className="tier-header" style={{ color: config.color }}>
                                        <div className="tier-line" style={{ background: config.color }} />
                                        <h2 className="tier-title">{config.label}</h2>
                                        <div className="tier-line" style={{ background: config.color }} />
                                    </div>
                                    <div className={`tier-grid tier-${config.size}`}>
                                        {grouped[tier].map(sponsor => (
                                            <a
                                                key={sponsor._id}
                                                href={sponsor.website || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sponsor-card"
                                                style={{ '--sponsor-color': config.color, '--sponsor-glow': config.glow }}
                                            >
                                                <div className="sponsor-logo-placeholder">
                                                    {sponsor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                </div>
                                                <span className="sponsor-name">{sponsor.name}</span>
                                                <span className="sponsor-tier-badge" style={{ color: config.color }}>
                                                    {tier.toUpperCase()}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Become a Sponsor CTA */}
                <div className="sponsor-cta">
                    <h2>Become a Sponsor</h2>
                    <p>Partner with CIPHER'26 and showcase your brand to 1000+ talented students and tech enthusiasts.</p>
                    <a href="mailto:cipher26@lbskg.ac.in" className="btn btn-primary">
                        Get In Touch
                    </a>
                </div>
            </div>
        </div>
    );
}
