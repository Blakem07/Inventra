import { client } from "./client";

export default async function createSale(values) {
  return await client(`/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}
