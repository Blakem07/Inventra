export async function client(path, options) {
  const baseURL = "http://localhost:3000";
  try {
    const response = await fetch(baseURL + path, options);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err.message);
  }
}
