import { Link } from 'react-router-dom';
import { FiDownload, FiShield } from 'react-icons/fi';
import './Certificates.css';

export default function Certificates() {
    return (
        <div className="page-wrapper certs-page">
            <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />
            <div className="container">
                <p className="section-subtitle">CIPHER'26</p>
                <h1 className="section-title">CERTIFICATES</h1>
                <p className="certs-intro">
                    Download your certificate or verify its authenticity.
                </p>

                <div className="certs-options">
                    <Link to="/certificates/download" className="cert-option-card option-download">
                        <div className="option-icon-wrap option-icon-green">
                            <FiDownload size={28} />
                        </div>
                        <h3>Download Certificate</h3>
                        <p>Search by your name or certificate ID to find and download your certificate.</p>
                        <span className="btn btn-primary option-btn">
                            <FiDownload size={15} /> Download
                        </span>
                    </Link>

                    <Link to="/certificates/verify" className="cert-option-card option-verify">
                        <div className="option-icon-wrap option-icon-cyan">
                            <FiShield size={28} />
                        </div>
                        <h3>Verify Certificate</h3>
                        <p>Enter a certificate ID or scan the QR code to verify its authenticity.</p>
                        <span className="btn btn-secondary option-btn">
                            <FiShield size={15} /> Verify
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
