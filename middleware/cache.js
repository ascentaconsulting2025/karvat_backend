/**
 * Caching Middleware for Public API Endpoints
 * Adds appropriate Cache-Control headers for static/cacheable responses
 */

/**
 * Cache middleware for public GET endpoints (no authentication required)
 * Sets Cache-Control headers for CDN and browser caching
 * 
 * @param maxAge - Maximum age in seconds (default: 600s = 10 minutes)
 */
const cacheMiddleware = (maxAge = 600) => {
  return (req, res, next) => {
    // Only cache successful GET requests without authentication
    if (req.method === 'GET' && !req.headers.authorization) {
      // Public cache: CDN can cache, expires in maxAge seconds
      res.set(
        'Cache-Control',
        `public, max-age=${maxAge}, s-maxage=${maxAge}`
      );
      
      // Add ETag and Vary for efficient cache validation and CORS compatibility
      res.set('Vary', 'Accept-Encoding, Origin');
    } else if (req.headers.authorization) {
      // Never cache authenticated requests
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
  };
};

/**
 * No-cache middleware for dynamic endpoints (e.g., those that change frequently)
 * Use this for write operations or user-specific data
 */
const noCacheMiddleware = () => {
  return (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  };
};

module.exports = {
  cacheMiddleware,
  noCacheMiddleware,
};
