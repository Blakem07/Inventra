# Architecture

## Application Configuration

### Runtime Configuration

- PORT (environment variable)
- MONGODB_URI (environment variable)

### Static Configuration

- BUSINESS_TIMEZONE defined in `appConfig`
- Not environment-driven
- Used for business-day bucketing logic

---

## Naming Conventions

### API vs Database Naming

- API payloads and responses use camelCase
- MongoDB document fields use snake_case

Example:

- API: `categoryId`, `reorderLevel`, `onHand`
- DB: `category_id`, `reorder_level`, `on_hand`

---

## Core Invariants

### Stock Integrity

- `products.on_hand` represents current stock state.
- Stock never drops below zero.
- Every stock change creates a `stock_movements` audit record.
- All stock mutations occur exclusively inside `StockService`.

---

### Sales Atomicity

Recording a sale commits as a single transaction:

- `sales` created
- `sale_items` created
- `stock_movements` OUT created and linked to sale
- `products.on_hand` decremented
- `daily_summaries` upserted for correct business-day bucket

All operations commit together or none commit.

---

### Daily Summary Bucketing

- Sale `occurred_at` stored as UTC instant.
- Business-day bucketing computed using `BUSINESS_TIMEZONE`.
- Resulting `summary_date` formatted as `YYYY-MM-DD`.
