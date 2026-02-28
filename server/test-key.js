const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

try {
    const serviceAccountPath = path.join(__dirname, 'config', 'serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
        console.error('File found.');
        process.exit(1);
    }
    const serviceAccount = require(serviceAccountPath);
    console.log('Key extracted from JSON.');
    let privateKey = serviceAccount.private_key;

    // Attempt standard fix just in case, though we know it didn't help before
    privateKey = privateKey.replace(/\\n/g, '\n');

    console.log('Key Length:', privateKey.length);
    // Check for non-ascii
    for (let i = 0; i < privateKey.length; i++) {
        const code = privateKey.charCodeAt(i);
        if (code < 32 && code !== 10 && code !== 13) {
            console.log(`Found non-printable char code ${code} at index ${i}`);
        }
    }

    console.log('First 50 chars:', privateKey.substring(0, 50));
    console.log('Last 50 chars:', privateKey.substring(privateKey.length - 50));

    // Try to create a key object
    try {
        crypto.createPrivateKey(privateKey);
        console.log('SUCCESS: Key is valid according to Node crypto.');
    } catch (e) {
        console.error('Crypto error:', e.message);
    }
} catch (err) {
    console.error('FAILURE: Key is invalid.');
    console.error(err);
}
