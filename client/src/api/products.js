import { client } from "./client";

export async function listProducts() {
  return await client("/products");
}
