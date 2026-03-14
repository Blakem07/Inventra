import { client } from "./client";

export async function createStockMovement(values) {
  return await client(`/stock/movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}
