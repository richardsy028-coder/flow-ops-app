export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url).origin;

  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/?paid=success`,
    cancel_url: `${origin}/?paid=cancelled`,
    "line_items[0][price_data][currency]": "php",
    "line_items[0][price_data][product_data][name]": "Clarity Flow COO-Level Report",
    "line_items[0][price_data][unit_amount]": "250000",
    "line_items[0][quantity]": "1"
  });

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const session = await r.json();
  return Response.json({ url: session.url });
}