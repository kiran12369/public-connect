require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

// Support both correct and misspelled keys so Render env typos don't crash startup
function normalizeMongoUri() {
    const uri = process.env.MONGODB_URI || process.env.MANGODB_URI;
    if (uri && !process.env.MONGODB_URI) {
        process.env.MONGODB_URI = uri;
    }
    return uri;
}

function validate() {
    const mongoUri = normalizeMongoUri();
    if (!mongoUri || !mongoUri.trim()) {
        throw new Error('Missing required env: MONGODB_URI');
    }
    if (isProd && !process.env.CORS_ORIGIN) {
        process.env.CORS_ORIGIN = '*';
    }
}

module.exports = { validate, isProd };
