import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiCamera, FiAward, FiUser, FiCalendar, FiBookOpen, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import API from '../utils/api';
import './CertificateVerify.css';

export default function CertificateVerify() {
    const [searchParams] = useSearchParams();
    const [certId, setCertId] = useState(searchParams.get('id') || '');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');
    const [dataReady, setDataReady] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Auto-verify if ?id= is in the URL
    useEffect(() => {
        setDataReady(true);
    }, []);

    useEffect(() => {
        const urlId = searchParams.get('id');
        if (urlId && dataReady) {
            setCertId(urlId);
            verifyCert(urlId);
        }
    }, [searchParams, dataReady]);

    async function verifyCert(id) {
        const query = (id || certId).trim();
        if (!query) { setError('Please enter a Certificate ID or Name'); return; }
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await API.get(`/certificates/search?q=${encodeURIComponent(query)}`);

            if (data.length === 1) {
                setResult({ found: true, data: buildResult(data[0]), multiple: false });
            } else if (data.length > 1) {
                setResult({ found: true, multiple: true, list: data.map(buildResult) });
            } else {
                setResult({ found: false });
            }
        } catch (err) {
            console.error('Verify error:', err);
            setResult({ found: false });
        }
        setLoading(false);
    }

    function buildResult(row) {
        return {
            name: row['name'] || 'N/A',
            event: row['event name'] || row['event'] || "CIPHER'26",
            type: row['certificate type'] || row['type'] || 'Participation',
            date: row['event date'] || row['date'] || 'March 23, 2026',
            certId: (row['certificate id'] || '').toUpperCase(),
            college: row['college'] || '',
        };
    }

    // QR Scanner using camera
    async function startScan() {
        setScanning(true);
        setResult(null);
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                scanFrame();
            }
        } catch (err) {
            setError('Camera access denied. Please enter the Certificate ID manually.');
            setScanning(false);
        }
    }

    function stopScan() {
        setScanning(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }

    function scanFrame() {
        if (!videoRef.current || !scanning) return;
        const video = videoRef.current;
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            requestAnimationFrame(scanFrame);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Use BarcodeDetector if available
        if ('BarcodeDetector' in window) {
            const detector = new BarcodeDetector({ formats: ['qr_code'] });
            detector.detect(canvas).then(barcodes => {
                if (barcodes.length > 0) {
                    const url = barcodes[0].rawValue;
                    handleQRResult(url);
                } else {
                    requestAnimationFrame(scanFrame);
                }
            }).catch(() => requestAnimationFrame(scanFrame));
        } else {
            // Fallback — no native QR support
            setError('QR scanning not supported on this browser. Please enter the ID manually.');
            stopScan();
        }
    }

    function handleQRResult(url) {
        stopScan();
        // Extract ID from URL like https://yoursite.com/verify?id=CERT001
        try {
            const u = new URL(url);
            const id = u.searchParams.get('id') || url;
            setCertId(id);
            verifyCert(id);
        } catch {
            // Not a URL, treat as raw ID
            setCertId(url);
            verifyCert(url);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyCert();
    };

    /* Reusable card for a single certificate */
    const CertCard = ({ d }) => (
        <div className="verify-result result-valid">
            <div className="result-header result-valid-header">
                <FiCheckCircle size={28} />
                <div>
                    <h3>Certificate Verified ✅</h3>
                    <p>This certificate is authentic and issued by CIPHER'26.</p>
                </div>
            </div>
            <div className="result-details">
                <div className="result-row">
                    <div className="result-item">
                        <span className="result-label"><FiAward size={14} /> Certificate ID</span>
                        <span className="result-value">{d.certId}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label"><FiUser size={14} /> Name</span>
                        <span className="result-value">{d.name}</span>
                    </div>
                </div>
                <div className="result-row">
                    <div className="result-item">
                        <span className="result-label"><FiBookOpen size={14} /> Event</span>
                        <span className="result-value">{d.event}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label"><FiAward size={14} /> Certificate Type</span>
                        <span className="result-value type-badge">{d.type}</span>
                    </div>
                </div>
                <div className="result-row">
                    <div className="result-item">
                        <span className="result-label"><FiCalendar size={14} /> Event Date</span>
                        <span className="result-value">{d.date}</span>
                    </div>
                    {d.college && (
                        <div className="result-item">
                            <span className="result-label"><FiBookOpen size={14} /> College</span>
                            <span className="result-value">{d.college}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper verify-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container">
                <p className="section-subtitle">Authenticity Check</p>
                <h1 className="section-title">CERTIFICATE VERIFICATION</h1>
                <p className="verify-intro">
                    Search by your <strong>Name</strong>, <strong>Certificate ID</strong>, or <strong>scan the QR code</strong> to verify.
                </p>

                {/* Search Box */}
                <div className="verify-search-card">
                    <form onSubmit={handleSubmit} className="verify-form">
                        <div className="verify-input-wrap">
                            <FiSearch className="verify-input-icon" size={18} />
                            <input
                                type="text"
                                className="verify-input"
                                placeholder="Enter Name or Certificate ID (e.g. CT26001)"
                                value={certId}
                                onChange={e => setCertId(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="verify-actions">
                            <button type="submit" className="btn btn-primary verify-btn" disabled={loading}>
                                {loading ? 'Searching...' : <><FiSearch size={15} /> Verify</>}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary verify-btn"
                                onClick={scanning ? stopScan : startScan}
                            >
                                {scanning ? <><FiX size={15} /> Stop</> : <><FiCamera size={15} /> Scan QR</>}
                            </button>
                        </div>
                    </form>

                    {/* QR Scanner */}
                    {scanning && (
                        <div className="qr-scanner-wrap">
                            <video ref={videoRef} className="qr-video" playsInline muted />
                            <div className="qr-overlay">
                                <div className="qr-frame" />
                            </div>
                            <p className="qr-hint">Point your camera at the QR code</p>
                        </div>
                    )}

                    {error && <p className="verify-error"><FiAlertCircle size={14} /> {error}</p>}
                </div>

                {/* Results */}
                {result && (
                    <>
                        {result.found ? (
                            result.multiple ? (
                                /* Multiple name matches */
                                <div className="multi-results">
                                    <p className="multi-results-info">
                                        Found <strong>{result.list.length}</strong> certificates matching "<strong>{certId}</strong>"
                                    </p>
                                    <div className="multi-results-grid">
                                        {result.list.map((d, i) => <CertCard key={i} d={d} />)}
                                    </div>
                                </div>
                            ) : (
                                /* Single match */
                                <CertCard d={result.data} />
                            )
                        ) : (
                            <div className="verify-result result-invalid">
                                <div className="result-header result-invalid-header">
                                    <FiAlertCircle size={28} />
                                    <div>
                                        <h3>Certificate Not Found</h3>
                                        <p>No certificate found for "<strong>{certId}</strong>". Please check and try again.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Help text */}
                {!result && !scanning && (
                    <div className="verify-help">
                        <h4>How to verify?</h4>
                        <div className="help-steps">
                            <div className="help-step">
                                <span className="step-num">1</span>
                                <p>Enter your <strong>Name</strong> or <strong>Certificate ID</strong> (e.g. CT26001)</p>
                            </div>
                            <div className="help-step">
                                <span className="step-num">2</span>
                                <p>Or <strong>scan the QR code</strong> printed on your certificate</p>
                            </div>
                            <div className="help-step">
                                <span className="step-num">3</span>
                                <p>View details and <strong>download</strong> your certificate</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

