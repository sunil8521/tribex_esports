import multer from 'multer';
import type { RequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new ApiError(400, 'Only image files are allowed'));
        }
        cb(null, true);
    },
});

/** Accept a single `thumbnail` field */
export const uploadThumbnail: RequestHandler = upload.single('thumbnail') as RequestHandler;
