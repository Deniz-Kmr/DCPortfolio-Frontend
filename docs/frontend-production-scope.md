# Frontend Production Scope

## Goal

The production-facing DCPortfolio frontend is a public backend developer portfolio.

It is not intended to expose the admin UI in the public production build.

## Production Public Site

Enabled routes:

- /
- /about
- /projects
- /projects/:slug
- /technologies
- /cv
- /experience
- /certificates
- /contact

Disabled or hidden routes:

- /admin/*
- /admin/login
- /admin/dashboard
- all admin management routes

## Admin UI Strategy

The admin UI remains in the same frontend repository for now.

It is controlled by an environment flag:

```env
VITE_ENABLE_ADMIN_UI=true
```

When the flag is false, admin routes must not render the admin app.

## Important Security Note

The frontend admin flag is not a security boundary.

Real security must be enforced by the backend:

- JWT authentication
- Role-based authorization
- Rate limiting
- HTTPS
- Secure CORS policy
- Safe error handling
- No secrets in frontend code

## Environments

| Scenario | VITE_ENABLE_ADMIN_UI | VITE_APP_ENV | VITE_API_TARGET | Description |
| --- | --- | --- | --- | --- |
| Local public + admin | true | local | local | Development mode with local API |
| Production public site | false | production | production | Public portfolio only |
| Local admin against production API | true | local-admin | production | Local admin UI managing production API |

## Local Admin Against Production API

This can be useful for content management.

Example:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_ADMIN_UI=true
VITE_APP_ENV=local-admin
VITE_API_TARGET=production
```

This mode must show a visible warning inside admin UI because actions affect production data.

## Not Doing Yet

- Separate admin repository
- Desktop admin application
- Tauri/Electron app
- Admin login flow
- CRUD screens
- Production deployment
