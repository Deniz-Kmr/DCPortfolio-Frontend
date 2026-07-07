# Frontend Deployment Preparation Notes

## Purpose

This document summarizes the production preparation strategy for the DCPortfolio frontend.

The frontend is a Vite React application served by Nginx in production Docker images.

This document does not perform a real deployment. It only documents deployment preparation, environment strategy, and verification steps.

## Production Public Frontend Strategy

The public production frontend must be built with:

```text
VITE_ENABLE_ADMIN_UI=false
```

This keeps the admin UI disabled in the public-facing frontend image.

Expected behavior for public production builds:

```text
/admin
/admin/login
/admin/dashboard
/admin/projects
/admin/technologies
```

These routes should not render the admin panel. They should show the admin disabled screen.

The public navigation must not expose an admin link.

## Admin Management Strategy

The backend admin APIs remain protected by:

- JWT authentication
- Admin role authorization
- backend validation
- backend rate limiting where configured

The admin UI can be used in controlled environments by building or running the frontend with:

```text
VITE_ENABLE_ADMIN_UI=true
```

For early production maintenance, the recommended controlled workflow is:

```text
Local admin frontend -> production API -> production database
```

Example local admin frontend environment:

```text
VITE_ENABLE_ADMIN_UI=true
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=local-admin
VITE_API_TARGET=production
```

The production API CORS policy must explicitly allow the local admin origin if this workflow is used.

For a later professional setup, deploy a separate protected admin frontend such as:

```text
https://admin.example.com
```

The public frontend can stay admin-disabled while the admin frontend is deployed separately with admin UI enabled.

## API URL Strategy

Vite environment variables are build-time values.

The frontend API base URL must be browser-accessible.

Correct examples:

```text
http://localhost:8080
https://api.example.com
```

Incorrect for browser API calls:

```text
http://api:8080
```

Docker service names such as `api` only resolve inside the Docker network. They do not resolve in the user's browser.

Changing `VITE_API_BASE_URL` requires rebuilding the frontend image.

## Full-stack Local Compose Strategy

The full-stack compose file lives in the backend repository:

```text
DCPortfolio-Backend/docker-compose.fullstack.yml
```

It builds the frontend from:

```text
../DCPortfolio-Frontend
```

For local full-stack verification, the frontend service is built with:

```text
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_ADMIN_UI=false
VITE_APP_ENV=production
VITE_API_TARGET=local
```

The frontend is served at:

```text
http://localhost:8081
```

The backend API is served at:

```text
http://localhost:8080
```

The backend CORS configuration must allow:

```text
http://localhost:8081
```

## Nginx Runtime Behavior

The production frontend image serves static files with Nginx.

SPA fallback is required for React Router routes:

```nginx
try_files $uri $uri/ /index.html;
```

This allows direct refreshes on routes such as:

```text
/projects
/projects/{slug}
/admin/login
/random-not-found
```

to return the React application instead of an Nginx 404.

## Static Asset Caching

Hashed Vite assets under `/assets/` are cached aggressively:

```text
Cache-Control: public, max-age=31536000, immutable
```

The HTML entry point uses:

```text
Cache-Control: no-cache
```

This lets the browser revalidate the app shell while keeping hashed assets cached.

## Security Headers

The Nginx configuration currently sends:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

CSP is intentionally not finalized here.

A production CSP should be configured later after real domains, API origins, image origins, font origins, analytics, and other external resources are finalized.

## Frontend Verification Checklist

Run local checks:

```bash
npm run build
```

Build production-like Docker image:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  --build-arg VITE_ENABLE_ADMIN_UI=false \
  --build-arg VITE_APP_ENV=production \
  --build-arg VITE_API_TARGET=local \
  -t dcportfolio-frontend:deployment-prep .
```

Run the image:

```bash
docker run --rm \
  -p 8081:80 \
  --name dcportfolio-frontend-deployment-prep \
  dcportfolio-frontend:deployment-prep
```

Test routes:

```text
http://localhost:8081/
http://localhost:8081/projects
http://localhost:8081/admin
http://localhost:8081/admin/login
http://localhost:8081/admin/dashboard
http://localhost:8081/random-not-found
```

Expected:

- Public routes load.
- Admin routes show the admin disabled screen.
- Unknown routes are handled by React Router.
- Nginx returns `200 OK` for SPA routes.
- Security headers are present.
- Hashed assets use immutable cache headers.

## Full-stack Verification Checklist

From the backend repository:

```bash
docker compose -f docker-compose.fullstack.yml up -d --build
```

Then test:

```text
http://localhost:8080/api/public/projects
http://localhost:8081/
http://localhost:8081/projects
http://localhost:8081/admin/login
```

CORS test:

```bash
curl -i \
  -H "Origin: http://localhost:8081" \
  http://localhost:8080/api/public/projects
```

Expected:

```text
Access-Control-Allow-Origin: http://localhost:8081
```

Stop the stack:

```bash
docker compose -f docker-compose.fullstack.yml down
```

## Secret and Environment Rules

Frontend build args are public and visible in the generated static frontend bundle.

Do not pass these as frontend build args:

- JWT keys
- setup keys
- database passwords
- connection strings
- private tokens

Use only public frontend values such as:

```text
VITE_API_BASE_URL
VITE_ENABLE_ADMIN_UI
VITE_APP_ENV
VITE_API_TARGET
```

Do not commit:

- `.env`
- `node_modules`
- `dist`
- real production API URLs unless intentionally configured during deployment
- real secret values

## Out of Scope

This document does not configure:

- real deployment
- DNS
- SSL certificates
- CDN
- CI/CD
- backend production hosting
- production database hosting
- runtime dynamic config
