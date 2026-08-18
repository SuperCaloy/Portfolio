/**
 * Optimizes a Cloudinary image URL for delivery by appending transformations.
 * Converts to auto format (WebP/AVIF), auto quality, and resizes width.
 * 
 * @param {string} url - The original image URL (e.g. from Cloudinary)
 * @param {number} width - The target width to resize to
 * @returns {string} The optimized URL
 */
export function optimizeCloudinaryUrl(url, width = 800) {
    if (!url || typeof url !== 'string') return url;

    // Check if it's a Cloudinary URL and contains the /upload/ segment
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        // Avoid double-transforming if already transformed
        if (url.includes('/upload/f_auto')) return url;
        
        // Inject transformations right after /upload/
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }

    return url;
}
