# Inventra

Cloud-connected inventory and sales management backend for small to mid-scale retail operations.

Tracks products, stock movements, pricing, and transactions with a transaction-safe architecture and scalable data model designed for future multi-store and SaaS expansion.

---

## Backend Stack

- Node.js
- Express (REST API)
- MongoDB Atlas
- Mongoose ODM
- ES Modules

---

## Quick Start

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

## Documentation

See the `/docs` directory for:

- `architecture.md` – System invariants and guarantees
- `api.md` – Complete API reference
- `testing.md` – Postman artifacts and validation sequence
