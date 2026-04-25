export async function onRequestPost() {
  return new Response(JSON.stringify({
    message: "API is clean and working."
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
