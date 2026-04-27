# API Reference

Base URL:

    http://localhost:${PORT}

---

## System

### GET `/health` (200)

Response:

    { "status": "ok" }

---

## Categories

### POST `/categories` (201)

Body:

    { "name": "General" }

Errors:

- 400 Invalid body
- 409 Duplicate name

---

### GET `/categories` (200)

Response:

    [
      {
        "_id": "...",
        "name": "General",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]

Notes:

- Categories are not deleted to preserve product references.

---

## Products

### POST `/products` (201)

Body:

    {
      "name": "Test Item",
      "skuOrBarcode": "TEST-001",
      "categoryId": "696a1c7eb14dd0a32a725710",
      "unit": "pcs",
      "price": 10,
      "reorderLevel": 5,
      "isActive": true,
      "onHand": 0
    }

Errors:

- 400 Invalid body
- 404 Category not found
- 409 Duplicate SKU

---

### GET `/products` (200)

Query parameters:

- `search`
- `categoryId`
- `activeOnly` (default true)

Computed `status`:

- `OUT` if `on_hand == 0`
- `LOW` if `0 < on_hand <= reorder_level`
- `OK` otherwise

---

### GET `/products/:id` (200)

Errors:

- 400 Invalid ID
- 404 Not found

---

### PUT `/products/:id` (200)

- Updates metadata only
- `onHand` cannot be modified here

Errors:

- 400 Invalid ID or payload
- 404 Not found

---

### PATCH `/products/:id/archive` (200)

- Soft archive
- Idempotent

---

## Stock

### POST `/stock/movements` (201)

Body:

    {
      "productId": "696a1ce6b14dd0a32a725713",
      "movementType": "IN",
      "quantity": 10,
      "occurredAt": "2026-02-13T10:06:31.420Z",
      "performedBy": "Staff A",
      "reason": "Initial stock",
      "note": "optional"
    }

Rules:

- `OUT` cannot reduce stock below zero
- `ADJUST` sets absolute `onHand`

---

### GET `/stock/movements` (200)

Query parameters:

- `from`
- `to`
- `productId`

---

## Sales

### POST `/sales` (201)

Body:

    {
      "occurredAt": "2026-02-13T10:06:31.420Z",
      "paymentMethod": "Cash",
      "performedBy": "Staff A",
      "note": "test sale",
      "items": [
        {
          "productId": "696a1ce6b14dd0a32a725713",
          "quantity": 3
        }
      ]
    }

Response:

    { "saleId": "...", "totalAmount": 300 }

Errors:

- 400 Invalid payload
- 404 Product not found or inactive
- 422 Insufficient stock

---

### GET `/sales` (200)

Query parameters:

- `from`
- `to`

---

## Dashboard

### GET `/dashboard/summary` (200)

Response:

    {
      "summaryDate": "2026-02-13",
      "lowStockCount": 1,
      "outOfStockCount": 0,
      "salesCountToday": 1,
      "totalSalesAmountToday": 300,
      "itemsSoldToday": 3,
      "recentActivity": []
    }

---

## Reports

### GET `/reports/stock-levels`

- Source: `products`
- Optional filters: `categoryId`, `activeOnly`

### GET `/reports/sales?from&to`

- Source: `sales`

### GET `/reports/movements?from&to&productId`

- Source: `stock_movements`
