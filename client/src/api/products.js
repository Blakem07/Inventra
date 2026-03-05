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

export async function updateProduct(id, values) {
  return await client(`/products/${id}`, {
    method: "PUT",
    headers: { "Content Type": "application/json" },
    body: JSON.stringify(values),
  });
}
