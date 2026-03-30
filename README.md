# Inventra

Full-stack inventory and sales management system for small to mid-scale retail operations.

Inventra provides a transaction-safe backend and a deterministic, test-driven frontend for managing products, stock, sales, and reporting. Designed for scalability toward multi-store and SaaS deployment.

---

## System Overview

- Frontend: React (Vite), React Router
- Backend: Node.js, Express, MongoDB Atlas
- Architecture: REST-based client–server separation
- Design goal: transaction safety, predictable state, and scalable data model

---

## Backend Stack

- Node.js
- Express (REST API)
- MongoDB Atlas
- Mongoose ODM
- ES Modules

---

## Frontend Stack

- React (Vite)
- React Router
- Local component state (no global store)
- Fetch API (custom client wrapper)
- Vitest + Testing Library (TDD)
- Tailwind CSS
- shadcn/ui

---

## Project Structure

```
/client
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
  /config
  /docs
  /helpers
  /middlewares
  /models
  /postman
  /routes
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

Client:

- VITE_API_BASE_URL

---

## Documentation

See the `/server/docs` directory for:

- `architecture.md` – System invariants and guarantees
- `api.md` – Complete API reference
- `testing.md` – Backend validation sequence

---

## Status

Backend v1: complete  
Frontend v1: complete

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
