import { client } from "./client.js";
export async function authenticateDemo(password) {
  return await client(`/demo/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export async function checkDemoSession() {
  return await client(`/demo/session`);
}
