import { client } from "./client";

export async function listProducts() {
  return await client("/products");
}

export async function createProduct(values) {
  return await client("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}
