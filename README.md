# Inventra

Full-stack inventory and sales management system for small to mid-scale retail operations.

Inventra provides a transaction-safe backend and a deterministic, test-driven frontend for managing products, stock, sales, and reporting. Designed for scalability toward multi-store and SaaS deployment.

---

## System Overview

- Frontend: React (Vite), React Router
- Backend: Node.js, Express, MongoDB Atlas
- Architecture: REST-based client–server separation
- Design goal: transaction safety, predictable state, and scalable data model
- Demo access layer: cookie-based session gate enforced by backend

---

## Backend Stack

- Node.js
- Express (REST API)
- MongoDB Atlas
- Mongoose ODM
- ES Modules
- Cookie-based session (demo access layer)
- CORS with credentialed requests

---

## Frontend Stack

- React (Vite)
- React Router
- Local component state (no global store)
- Fetch API (custom client wrapper)
- Vitest + Testing Library (TDD)
- Tailwind CSS
- shadcn/ui
- Route-level access gating via backend session check

---

## Project Structure

```
/client
  /config
  /public
  /src
    /api
    /app
    /assets
    /components
      /layout
      /ui
    /lib
    /pages
    /tests
    /utils
    /validation

/server
  /auth
  /config
  /docs
  /helpers
  /middlewares
  /models
  /postman
  /routes
  /scripts
  /services
  /utils
  /validators
  /docs
```

---

## Backend Setup

### Prerequisites

- Node.js (LTS recommended)
- MongoDB Atlas connection string

### Install

cd server
npm install

### Environment Variables

Create a `.env` file inside `server/`:

PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
DEMO_PASSWORD=yourpassword
DEMO_COOKIE_SECRET=your-secret
FRONTEND_URL=[http://localhost:5173](http://localhost:5173)
NODE_ENV=development

### Start Server

node index.js

### Health Check

GET `/health`

Response:

{ "status": "ok" }

---

## Frontend Setup

cd client
npm install

### Development

npm run dev

### Testing

npm run test

### Environment Variables

Create a `.env` file inside `client/`:

VITE_API_BASE_URL=http://localhost:3000

---

## Features

- Inventory management (search, filter, computed status)
- Product creation and editing with validation
- Sales recording with line items
- Stock movement tracking/creation (IN, OUT, ADJUST)
- Dashboard summaries
- Reports (sales and movements with filters)
- Archive workflow

---

## Demo Access

The application uses a lightweight demo access layer instead of full authentication.

- Access is controlled by the backend using a signed cookie (`demoToken`)
- No user accounts or JWT system are used
- Frontend checks session state via `/demo/session`
- Protected routes are gated until session validation completes
- All business API routes are enforced server-side

Public routes:

- POST `/demo/access`
- GET `/demo/session`
- POST `/demo/logout`

---

## Frontend Architecture

- Test-driven development (Vitest)
- Deterministic UI state (no hidden mutations)
- API abstraction layer (`/api`)
- Controlled form components with validation
- Client-side filtering for inventory
- Standardized loading and error states

---

## API Contract

- All requests use JSON
- Non-2xx responses normalized in `api/client.js`
- Frontend uses camelCase
- Backend compatibility handled via adapters

---

## Testing

Frontend:

- Vitest + Testing Library
- User-level behavioural assertions
- Mocked fetch for deterministic tests

Backend:

- Postman validation (see `/docs/testing.md`)

---

## Demo Data

The system uses a shared demo dataset for evaluation and demonstration.

- Data is synthetic and non-sensitive
- All users interact with the same dataset
- State may change during usage

### Resetting Demo Data

A manual seed script is provided:

```
node server/scripts/seedDemo.js
```

This will:

- clear existing data
- insert a fixed baseline dataset

Intended for use before demonstrations or evaluations.

---

## Client Routes

| Route               | Description           |
| ------------------- | --------------------- |
| /                   | Dashboard             |
| /inventory          | Inventory list        |
| /inventory/new      | Create product        |
| /inventory/:id/edit | Edit product          |
| /sales/new          | Record sale           |
| /stock/new          | Create stock movement |
| /reports            | Reports               |

---

## Inventory Status Rules

If status exists → use it

Else compute:

- OUT: onHand === 0
- LOW: onHand > 0 && onHand <= reorderLevel
- OK: otherwise

---

## Environment Variables

Server:

- PORT
- MONGODB_URI
- DEMO_PASSWORD
- DEMO_COOKIE_SECRET
- FRONTEND_URL
- NODE_ENV

Client:

- VITE_API_BASE_URL

---

## Documentation

See the /server/docs directory for:

architecture.md – System invariants and guarantees
api.md – Complete API reference
testing.md – Backend validation sequence
demo-access.md – Demo session flow and access control

---

## Status

Backend v1: complete (with demo access layer)
Frontend v1: complete (with protected routing)

System supports:

- Products
- Inventory
- Sales
- Stock movements
- Dashboard
- Reports

---

## Future Work

- Authentication
- Multi-store support
- CSV export for reports
- Caching layer (React Query)
