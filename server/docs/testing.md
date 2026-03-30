# Testing and Evidence

## Postman Artifacts

Stored in:

    /postman/Inventra.postman_collection.json

Import this collection into Postman (Web or Desktop).

Set the base URL to:

    http://localhost:3000

Ensure the server is running before executing requests.

---

## Minimum Validation Sequence

1. Create category
2. Create product
3. Stock IN
4. Successful sale
5. Oversell attempt returns 422
6. Dashboard totals match `daily_summaries`
7. Reports return records
