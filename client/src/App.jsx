import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Register from './pages/Register';
import Schedule from './pages/Schedule';
import Sponsors from './pages/Sponsors';
import CertificateVerify from './pages/CertificateVerify';
import Certificates from './pages/Certificates';
import CertificateDownload from './pages/CertificateDownload';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {showLoader && <PageLoader onComplete={() => setShowLoader(false)} />}
      <Router>
      <Routes>
        {/* Admin routes (no navbar/footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Public routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <BottomNav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/register/:eventId" element={<Register />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/certificates/verify" element={<CertificateVerify />} />
              <Route path="/verify" element={<CertificateVerify />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/certificates/download" element={<CertificateDownload />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
      </Router>
    </>
  );
}

export default App;
