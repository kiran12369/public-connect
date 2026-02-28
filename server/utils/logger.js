const isProd = process.env.NODE_ENV === 'production';

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[process.env.LOG_LEVEL || (isProd ? 'info' : 'debug')] ?? 2;

function format(level, message, meta = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(Object.keys(meta).length ? { ...meta } : {}),
    };
    return isProd ? JSON.stringify(entry) : `[${entry.timestamp}] ${level.toUpperCase()}: ${message}${Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''}`;
}

const logger = {
    error: (msg, meta) => currentLevel >= 0 && console.error(format('error', msg, meta || {})),
    warn: (msg, meta) => currentLevel >= 1 && console.warn(format('warn', msg, meta || {})),
    info: (msg, meta) => currentLevel >= 2 && console.info(format('info', msg, meta || {})),
    debug: (msg, meta) => currentLevel >= 3 && console.debug(format('debug', msg, meta || {})),
};

module.exports = logger;
