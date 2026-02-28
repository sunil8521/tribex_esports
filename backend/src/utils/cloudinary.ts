import { v4 as uuid } from 'uuid';
import { getCloudinary } from '../config/cloudinary.js';
import { ApiError } from './apiError.js';

/**
 * Upload a single buffer to Cloudinary.
 * Returns the `secure_url` and `public_id`.
 */
export async function uploadToCloudinary(
    buffer: Buffer,
    folder = 'tribex'
): Promise<{ url: string; publicId: string }> {
    const cloudinary = getCloudinary();

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    public_id: uuid(),
                    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(new ApiError(500, error?.message ?? 'Cloudinary upload failed'));
                    }
                    resolve({ url: result.secure_url, publicId: result.public_id });
                }
            )
            .end(buffer);
    });
}

/**
 * Delete images from Cloudinary by public IDs.
 */
export async function deleteFromCloudinary(publicIds: string[]): Promise<void> {
    const cloudinary = getCloudinary();

    const promises = publicIds.map(
        (id) =>
            new Promise<void>((resolve, reject) => {
                cloudinary.uploader.destroy(id, (error) => {
                    if (error) return reject(error);
                    resolve();
                });
            })
    );
    await Promise.all(promises);
}
