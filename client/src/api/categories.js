import { client } from "./client";

export async function listCategories() {
  return client("/categories");
}
