import { useState } from 'react';
import { FiDownload, FiSearch, FiUser, FiAward, FiBookOpen, FiCalendar, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './CertificateDownload.css';

export default function CertificateDownload() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    async function search(e) {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const { data } = await API.get(`/certificates/search?q=${encodeURIComponent(query.trim())}`);
            setResults(data);
        } catch (err) {
            console.error('Search error:', err);
            setResults([]);
        }
        setLoading(false);
    }

    function getDlUrl(row) {
        let url = row['merged doc url - certificates'] || row['download url'] || '';
        if (url.includes('drive.google.com/file/d/')) {
            const fid = url.match(/\/d\/([^/]+)/)?.[1];
            if (fid) return `https://drive.google.com/uc?export=download&id=${fid}`;
        }
        return url;
    }

    return (
        <div className="page-wrapper dl-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container">
                <Link to="/certificates" className="dl-back"><FiArrowLeft size={16} /> Back to Certificates</Link>
                <p className="section-subtitle">CIPHER'26</p>
                <h1 className="section-title">DOWNLOAD CERTIFICATE</h1>
                <p className="dl-intro">
                    Search by your <strong>Name</strong> or <strong>Certificate ID</strong> to find and download your certificate.
                </p>

                <div className="dl-search-card">
                    <form onSubmit={search} className="dl-search-form">
                        <div className="dl-input-wrap">
                            <FiSearch className="dl-input-icon" size={16} />
                            <input
                                type="text"
                                className="dl-input"
                                placeholder="Name or Certificate ID"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary dl-search-btn" disabled={loading}>
                            {loading ? 'Searching...' : <><FiSearch size={14} /> Search</>}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {results !== null && (
                    results.length > 0 ? (
                        <div className="dl-results">
                            <p className="dl-results-count">Found <strong>{results.length}</strong> certificate{results.length > 1 ? 's' : ''}</p>
                            <div className="dl-grid">
                                {results.map((row, i) => (
                                    <div key={i} className="dl-card">
                                        <div className="dl-card-info">
                                            <div className="dl-row">
                                                <div className="dl-field">
                                                    <span className="dl-label"><FiAward size={12} /> Certificate ID</span>
                                                    <span className="dl-value">{(row['certificate id'] || '').toUpperCase()}</span>
                                                </div>
                                                <div className="dl-field">
                                                    <span className="dl-label"><FiUser size={12} /> Name</span>
                                                    <span className="dl-value">{row['name'] || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="dl-row">
                                                <div className="dl-field">
                                                    <span className="dl-label"><FiBookOpen size={12} /> Event</span>
                                                    <span className="dl-value">{row['event name'] || row['event'] || "CIPHER'26"}</span>
                                                </div>
                                                <div className="dl-field">
                                                    <span className="dl-label"><FiAward size={12} /> Type</span>
                                                    <span className="dl-value type-badge">{row['certificate type'] || 'Participation'}</span>
                                                </div>
                                            </div>
                                            <div className="dl-row">
                                                <div className="dl-field">
                                                    <span className="dl-label"><FiCalendar size={12} /> Date</span>
                                                    <span className="dl-value">{row['event date'] || 'March 23, 2026'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {getDlUrl(row) ? (
                                            <a href={getDlUrl(row)} target="_blank" rel="noopener noreferrer" className="btn btn-primary dl-btn">
                                                <FiDownload size={15} /> Download Certificate
                                            </a>
                                        ) : (
                                            <span className="dl-pending">Certificate will be available soon</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="dl-not-found">
                            <FiAlertCircle size={20} />
                            <p>No certificates found for "<strong>{query}</strong>". Please check your name or ID.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
