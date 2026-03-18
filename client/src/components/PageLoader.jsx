import { useEffect, useState } from 'react';
import logo from '../assets/cipher-logo.png';
import './PageLoader.css';

export default function PageLoader({ onComplete }) {
  const [phase, setPhase] = useState('boot');       // boot → decode → reveal → done
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('CIPHER');
  const [scanLine, setScanLine] = useState(0);

  const GLITCH_CHARS = 'アイウエオカキクケコ#@!%&XYZABCDE01';

  // Glitch text effect
  useEffect(() => {
    if (phase !== 'decode') return;
    const target = 'CIPHER';
    let iteration = 0;
    const interval = setInterval(() => {
      setGlitchText(
        target.split('').map((char, i) => {
          if (i < iteration) return char;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join('')
      );
      iteration += 0.4;
      if (iteration >= target.length + 1) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [phase]);

  // Progress bar
  useEffect(() => {
    if (phase !== 'boot' && phase !== 'decode') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        const increment = prev < 40 ? 2 : prev < 70 ? 1.2 : prev < 90 ? 0.6 : 0.3;
        return Math.min(prev + increment, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Phase sequencing
  useEffect(() => {
    // boot → decode
    const t1 = setTimeout(() => setPhase('decode'), 1500);
    // decode → reveal
    const t2 = setTimeout(() => setPhase('reveal'), 6000);
    // reveal → done (trigger exit)
    const t3 = setTimeout(() => {
      setPhase('done');
      setTimeout(() => onComplete?.(), 700);
    }, 8500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`pl-root ${phase === 'reveal' ? 'pl-exit' : ''}`}>

      {/* Scan line */}
      <div className="pl-scanline" style={{ top: `${scanLine}%` }} />

      {/* Grid overlay */}
      <div className="pl-grid" />

      {/* Corner brackets */}
      <div className="pl-corner pl-corner-tl" />
      <div className="pl-corner pl-corner-tr" />
      <div className="pl-corner pl-corner-bl" />
      <div className="pl-corner pl-corner-br" />

      {/* Main content */}
      <div className="pl-center">

        {/* Logo */}
        <div className={`pl-logo-wrap ${phase === 'decode' ? 'pl-logo-active' : ''}`}>
          <img src={logo} alt="CIPHER'26" className="pl-logo" />
          <div className="pl-logo-glow" />
        </div>

        {/* Glitch title */}
        <div className={`pl-title-wrap ${phase === 'decode' ? 'pl-title-active' : ''}`}>
          <div className="pl-cipher-text">{glitchText}</div>
          <div className="pl-year-text">'26</div>
        </div>

        {/* Tagline */}
        <div className={`pl-tagline ${phase === 'decode' ? 'pl-tagline-active' : ''}`}>
          DECODE THE FUTURE. REWRITE REALITY.
        </div>

        {/* Boot log */}
        <div className="pl-log">
          <div className={`pl-log-line ${phase !== 'boot' ? 'pl-log-done' : 'pl-log-active'}`}>
            <span className="pl-log-dot" />
            INITIALIZING SYSTEM...
          </div>
          <div className={`pl-log-line ${phase === 'decode' || phase === 'reveal' ? 'pl-log-done' : ''}`}>
            <span className="pl-log-dot" />
            LOADING CIPHER PROTOCOL...
          </div>
          <div className={`pl-log-line ${phase === 'reveal' ? 'pl-log-done' : ''}`}>
            <span className="pl-log-dot" />
            DECRYPTION COMPLETE
          </div>
        </div>

        {/* Progress bar */}
        <div className="pl-progress-wrap">
          <div className="pl-progress-track">
            <div
              className="pl-progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="pl-progress-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="pl-progress-label">
            <span className="pl-progress-pct">{Math.floor(progress)}%</span>
            <span className="pl-progress-status">
              {progress < 40 ? 'BOOTING' : progress < 80 ? 'LOADING' : progress < 100 ? 'ALMOST THERE' : 'READY'}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="pl-bottom-bar">
        <span>LBS COLLEGE OF ENGINEERING · KASARAGOD</span>
        <span>MARCH 23, 2026</span>
      </div>
    </div>
  );
}
