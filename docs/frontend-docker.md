# Frontend Docker Production Guide

## Purpose

This Dockerfile builds the DCPortfolio Vite React frontend and serves the generated static files with Nginx.

This guide covers only the frontend production image.

It does not configure full-stack Docker Compose, backend deployment, CI/CD, or runtime dynamic config.

## Architecture

The frontend is built in two stages:

1. Node build stage
   - Installs dependencies with `npm ci`
   - Builds the Vite application with `npm run build`
   - Uses Vite build-time environment variables

2. Nginx runtime stage
   - Serves the generated `dist` output
   - Handles SPA route fallback
   - Adds static asset caching
   - Adds basic security headers

## Build-time Environment

Vite environment variables are resolved at build time.

Required build args:

- `VITE_API_BASE_URL`
- `VITE_ENABLE_ADMIN_UI`
- `VITE_APP_ENV`
- `VITE_API_TARGET`

Changing these values requires rebuilding the frontend Docker image.

## Local Production-like Build

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  --build-arg VITE_ENABLE_ADMIN_UI=false \
  --build-arg VITE_APP_ENV=production \
  --build-arg VITE_API_TARGET=local \
  -t dcportfolio-frontend:prod-test .
```

## Run

If the backend local CORS policy allows `http://localhost:5173`, run the container on port `5173` for live API testing:

```bash
docker run --rm \
  -p 5173:80 \
  --name dcportfolio-frontend-prod-test \
  dcportfolio-frontend:prod-test
```

Alternative port-only frontend/Nginx test:

```bash
docker run --rm \
  -p 8081:80 \
  --name dcportfolio-frontend-prod-test \
  dcportfolio-frontend:prod-test
```

If live API data does not load on `8081` but the API works with curl, the likely reason is backend CORS origin configuration.

## Test Routes

```text
http://localhost:5173/
http://localhost:5173/projects
http://localhost:5173/projects/{real-slug}
http://localhost:5173/admin
http://localhost:5173/admin/login
http://localhost:5173/admin/dashboard
http://localhost:5173/random-not-found
```

Expected behavior:

- `/` opens the public portfolio.
- `/projects` opens the projects page.
- `/projects/{real-slug}` works with SPA fallback.
- `/admin`, `/admin/login`, and `/admin/dashboard` show the admin disabled screen in production public builds.
- Unknown routes are handled by React Router, not by an Nginx 404.

## SPA Fallback

Nginx uses this fallback:

```nginx
try_files $uri $uri/ /index.html;
```

This prevents direct refreshes on React Router routes from returning an Nginx 404.

## Static Asset Caching

Hashed Vite assets under `/assets/` are cached aggressively:

```text
Cache-Control: public, max-age=31536000, immutable
```

The HTML entry point uses:

```text
Cache-Control: no-cache
```

This allows the browser to revalidate `index.html` while keeping hashed assets cached.

## Security Headers

The Nginx config adds basic security headers:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

CSP is intentionally not configured here. It should be handled later when production domains, external assets, and API/static origins are finalized.

## Admin UI Production Behavior

Production public frontend images must use:

```text
VITE_ENABLE_ADMIN_UI=false
```

This keeps the admin UI disabled in public production builds.

Expected disabled routes include:

```text
/admin
/admin/login
/admin/dashboard
/admin/projects
/admin/technologies
```

Backend admin API security remains protected separately by JWT and Admin role authorization.

## Environment and Secrets

- `.env` files are not copied into the Docker image.
- `node_modules` is not copied from the host.
- `dist` is not copied from the host.
- VITE variables are public build-time values, not secrets.
- Real JWT values, setup keys, database passwords, or connection strings must not be passed as frontend build args.
- Real production API URLs should be provided by deployment build configuration, not hardcoded in source code.

## Full-stack Compose

Full-stack local production-like Compose is handled from the backend repository:

```text
DCPortfolio-Backend/docker-compose.fullstack.yml
```

That compose file builds this frontend repository as the Nginx production image and serves it on:

```text
http://localhost:8081
```

The frontend build arg must use a browser-accessible API URL:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Do not use Docker service names such as `http://api:8080` as the browser-facing frontend API URL.

For more deployment preparation notes, see:

```text
docs/frontend-deployment-prep.md
```
