const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Simple in-memory brute force protection (per process)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function isLockedOut(ip) {
    const record = loginAttempts[ip];
    if (!record) return false;
    if (record.count >= MAX_ATTEMPTS) {
        if (Date.now() - record.lastAttempt < LOCKOUT_MS) return true;
        delete loginAttempts[ip]; // reset after lockout period
    }
    return false;
}

function recordFailedAttempt(ip) {
    if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: 0 };
    loginAttempts[ip].count += 1;
    loginAttempts[ip].lastAttempt = Date.now();
}

function clearAttempts(ip) {
    delete loginAttempts[ip];
}

// Admin login — credentials stored in .env, password compared with bcrypt
router.post('/login', async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    if (isLockedOut(ip)) {
        return res.status(429).json({ message: 'Too many failed attempts. Try again in 15 minutes.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Username check (constant-time-safe via early return after both checks)
    const validUsername = username === process.env.ADMIN_USERNAME;

    // Password check — support both bcrypt hash and plain (for backward compat)
    let validPassword = false;
    const storedPassword = process.env.ADMIN_PASSWORD || '';
    if (storedPassword.startsWith('$2')) {
        // Already a bcrypt hash
        validPassword = await bcrypt.compare(password, storedPassword);
    } else {
        // Plain text (legacy) — direct compare
        validPassword = password === storedPassword;
    }

    if (!validUsername || !validPassword) {
        recordFailedAttempt(ip);
        // Always return same message — no hint about which field was wrong
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    clearAttempts(ip);

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }  // reduced from 24h to 8h
    );
    res.json({ token, username });
});

// Verify token
router.get('/verify', require('../middleware/auth'), (req, res) => {
    res.json({ valid: true, admin: req.admin });
});

module.exports = router;
