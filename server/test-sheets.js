const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = process.env.GOOGLE_SHEET_RANGE || 'CT26!A:Z';

console.log('Environment Check:');
console.log('  API_KEY:', API_KEY ? '✓ Set' : '✗ Missing');
console.log('  SHEET_ID:', SHEET_ID ? '✓ Set' : '✗ Missing');
console.log('  RANGE:', RANGE);

if (!API_KEY || !SHEET_ID) {
    console.error('ERROR: Missing Google Sheets credentials!');
    process.exit(1);
}

// Try without range first to test basic access
const url1 = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}&fields=sheets(properties(title))`;
console.log('\nStep 1: Testing basic sheet access (no range)...');

fetch(url1)
    .then(r => {
        console.log('  Response Status:', r.status);
        if (r.status === 200) {
            return r.json().then(d => {
                console.log('  ✓ Sheet found!');
                console.log('  Sheet names:', d.sheets?.map(s => s.properties.title).join(', '));
                return true;
            });
        } else {
            throw new Error(`Status ${r.status}`);
        }
    })
    .then(success => {
        if (!success) return;
        // Now try fetching values
        console.log('\nStep 2: Fetching sheet values...');
        const encodedRange = encodeURIComponent(RANGE);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}?key=${API_KEY}`;
        return fetch(url);
    })
    .then(r => {
        if (!r) return;
        console.log('  Response Status:', r.status);
        if (r.ok) return r.json();
        throw new Error(`HTTP ${r.status}`);
    })
    .then(data => {
        if (!data) return;
        console.log('\n✓ Success!');
        console.log('  Rows in sheet:', data.values?.length || 0);
        if (data.values && data.values.length > 0) {
            console.log('  Headers:', data.values[0]);
            console.log('  Sample data rows:', data.values.slice(1, 3));
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('\n✗ Error:', err.message);
        process.exit(1);
    });
    
// Prevent timeout
setTimeout(() => {}, 10000);
