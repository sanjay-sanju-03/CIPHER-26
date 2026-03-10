import { FiPhone, FiMapPin, FiInstagram, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const CONTACTS = [
    { phone: '+91 8075340456', name: 'Miza M', role: 'Student Coordinator' },
    { phone: '+91 8547458075', name: 'Dr. Manoj Kumar G', role: 'HOD' },
    { phone: '+91 9495447684', name: 'Prof. Krishnaprasad P.K', role: 'Staff Coordinator' },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-glow" />

            {/* ── Contact Us Section ── */}
            <div className="contact-section">
                <div className="container">
                    <h2 className="contact-title">CONTACT US</h2>

                    <div className="contact-grid">
                        {/* Left — details */}
                        <div className="contact-info">
                            <div className="contact-brand">
                                <span className="logo-cipher">CIPHER</span>
                                <span className="logo-year">'26</span>
                            </div>

                            <p className="contact-sub">National Level Techno-Cultural Fest</p>
                            <p className="contact-sub">ASSOCIATION OF IT, 2025-26</p>
                            <p className="contact-sub">
                                <FiMapPin size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                LBS College of Engineering, Kasaragod
                            </p>

                            <div className="contact-phones">
                                {CONTACTS.map((c, i) => (
                                    <a key={i} href={`tel:${c.phone.replace(/\s/g, '')}`} className="contact-phone-row">
                                        <FiPhone size={13} className="phone-icon" />
                                        <span>
                                            <strong>{c.phone}</strong>
                                            <span className="phone-person"> ({c.name}, {c.role})</span>
                                        </span>
                                    </a>
                                ))}
                            </div>

                            <div className="contact-socials">
                                <a href="https://www.instagram.com/cipher.lbscek/?hl=en" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                                    <FiInstagram size={20} />
                                </a>
                                <a href="https://www.linkedin.com/company/cipherlbscek/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                                    <FiLinkedin size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Right — Google Maps */}
                        <div className="contact-map">
                            <iframe
                                title="LBS College of Engineering, Kasaragod"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3895.1817717090435!2d75.07822077511501!3d12.504107887769962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4846bda0b9525%3A0x1a6965b115fbfb96!2sLBS%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1772970679078!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="footer-bottom">
                <p>© 2026 CIPHER'26 — LBS College of Engineering, Kasaragod. All rights reserved.</p>
            </div>
        </footer>
    );
}
