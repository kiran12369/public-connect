const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';
    const code = err.code;

    if (status >= 500) {
        logger.error('Unhandled error', { err: message, stack: err.stack, path: req.path });
    }

    res.status(status).json({
        message: status >= 500 ? 'Something went wrong' : message,
        ...(code ? { code } : {}),
    });
}

module.exports = errorHandler;
