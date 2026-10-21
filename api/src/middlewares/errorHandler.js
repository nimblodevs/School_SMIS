import { AppError } from '../shared/errors/AppError.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const DATABASE_ERROR_MAP = {
    '23505': { status: 409, code: 'CONFLICT', message: 'A record with these values already exists' },
    '23503': {
        status: 409,
        code: 'CONFLICT',
        message: 'Referenced record does not exist or is still in use',
    },
};

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal Server Error';
    let details;

    if (err instanceof AppError) {
        status = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.errors;
    } else if (DATABASE_ERROR_MAP[err.code]) {
        ({ status, code, message } = DATABASE_ERROR_MAP[err.code]);
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        status = 401;
        code = 'UNAUTHORIZED';
        message = 'Session expired or token invalid';
    } else if (err.type === 'entity.parse.failed') {
        // body-parser JSON parse error
        status = 400;
        code = 'MALFORMED_JSON';
        message = 'Request body is not valid JSON';
    } else if (err.type === 'entity.too.large') {
        status = 413;
        code = 'PAYLOAD_TOO_LARGE';
        message = 'Request body exceeds the allowed size';
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        status = 413;
        code = 'PAYLOAD_TOO_LARGE';
        message = 'Uploaded file exceeds the 10 MB limit';
    } else if (err.code?.startsWith('LIMIT_')) {
        status = 400;
        code = 'BAD_REQUEST';
        message = 'Invalid multipart upload';
    }

    const logPayload = {
        method: req.method,
        url: req.originalUrl,
        status,
        code,
        userId: req.user?.id,
        schoolId: req.user?.schoolId,
    };
    if (status >= 500) {
        (req.log || logger).error({ ...logPayload, err }, 'Request failed');
    } else {
        (req.log || logger).warn(logPayload, 'Request rejected');
    }

    const isServerError = status >= 500;
    return res.status(status).json({
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
            ...(env.NODE_ENV === 'development' && isServerError && { stack: err.stack }),
        },
    });
};
