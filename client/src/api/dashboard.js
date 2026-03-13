import { client } from "./client";

export default async function getDashboardSummary() {
  return await client(`/dashboard/summary`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
