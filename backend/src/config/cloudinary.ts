import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

/**
 * Lazily configure Cloudinary on first use.
 * Calling `getCloudinary()` ensures config is applied right before the SDK is used,
 * not at module-import time when env might not be fully resolved.
 */
let configured = false;

export function getCloudinary() {
    if (!configured) {
        if (!env.cloudinaryName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
            throw new Error('Cloudinary env vars (CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not set');
        }
        cloudinary.config({
            cloud_name: env.cloudinaryName,
            api_key: env.cloudinaryApiKey,
            api_secret: env.cloudinaryApiSecret,
            secure: true,
        });
        configured = true;
    }
    return cloudinary;
}

export default cloudinary;
