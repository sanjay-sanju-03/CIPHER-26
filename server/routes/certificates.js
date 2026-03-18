const express = require('express');
const router = express.Router();

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = process.env.GOOGLE_SHEET_RANGE || 'CT26!A:Z';

// GET /api/certificates — fetch all certificate data from Google Sheets
router.get('/', async (req, res) => {
    try {
        if (!API_KEY || !SHEET_ID) {
            return res.status(500).json({ message: 'Google Sheets not configured' });
        }

        const encodedRange = encodeURIComponent(RANGE);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}?key=${API_KEY}`;
        console.log('Fetching sheet:', SHEET_ID, 'Range:', RANGE);
        const response = await fetch(url);

        if (!response.ok) {
            const errText = await response.text();
            console.error('Sheets API error:', response.status, errText);
            return res.status(500).json({ message: 'Failed to fetch from Google Sheets', detail: errText });
        }

        const data = await response.json();
        const rows = data.values || [];
        if (rows.length < 2) {
            return res.json([]);
        }

        // First row = headers, rest = data
        const headers = rows[0].map(h => h.trim().toLowerCase());
        const records = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
            return obj;
        });

        res.json(records);
    } catch (err) {
        console.error('Certificates route error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/certificates/search?q=SANJAY — search by name or cert ID
router.get('/search', async (req, res) => {
    try {
        const q = (req.query.q || '').trim().toUpperCase();
        if (!q) return res.status(400).json({ message: 'Search query required' });

        if (!API_KEY || !SHEET_ID) {
            return res.status(500).json({ message: 'Google Sheets not configured' });
        }

        const encodedRange = encodeURIComponent(RANGE);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(500).json({ message: 'Failed to fetch from Google Sheets' });
        }

        const data = await response.json();
        const rows = data.values || [];
        if (rows.length < 2) return res.json([]);

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const records = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
            return obj;
        });

        // Search by certificate ID (exact) or name (partial)
        const results = records.filter(r => {
            const id = (r['certificate id'] || '').toUpperCase();
            const name = (r['name'] || '').toUpperCase();
            return id === q || name.includes(q);
        });

        res.json(results);
    } catch (err) {
        console.error('Certificate search error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
