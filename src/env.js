// Runtime configuration for the built SPA.
//
// This file is intentionally NOT baked into the JS bundle at build time -
// it's plain, static-hosting-friendly config so the same built artifact
// can be pointed at different backends (local Docker Compose, EKS,
// whatever) without a rebuild. It loads before the Angular bundle (see
// index.html) and is read synchronously by api.interceptor.ts.
//
// In Docker, the container entrypoint overwrites this file from the
// API_URL environment variable at startup. In the real AWS deployment
// (S3 + CloudFront), the CI/CD pipeline overwrites it post-build, before
// syncing to S3, with the deployed backend's ALB/CloudFront URL.
window.__env__ = {
  apiUrl: 'http://localhost:8080/api',
};
