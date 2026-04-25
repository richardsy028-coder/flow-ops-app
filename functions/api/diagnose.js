export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  return new Response(JSON.stringify({
    message: "API is working",
    status: "success"
  }), {
    headers: { "Content-Type": "application/json" }
  });
}