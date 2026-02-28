require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const required = ['MONGODB_URI'];
const requiredInProd = ['CORS_ORIGIN'];

function validate() {
    const missing = required.filter((k) => !process.env[k] || process.env[k].trim() === '');
    if (missing.length) {
        throw new Error(`Missing required env: ${missing.join(', ')}`);
    }
    if (isProd) {
        const missingProd = requiredInProd.filter((k) => !process.env[k] || process.env[k].trim() === '');
        if (missingProd.length) {
            throw new Error(`Production requires: ${missingProd.join(', ')}`);
        }
    }
}

module.exports = { validate, isProd };
