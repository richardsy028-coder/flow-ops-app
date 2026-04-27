export async function onRequestPost({ request, env }) {
  try {
    const origin = new URL(request.url).origin;
    const { plan = "deep_report", currency = "php" } = await request.json().catch(() => ({}));

    const prices = {
      deep_report: {
        php: { amount: "499900", name: "FLOW Deep Diagnosis Report" },
        usd: { amount: "8900", name: "FLOW Deep Diagnosis Report" }
      },
      execution_sprint: {
        php: { amount: "1500000", name: "Premium Execution Sprint" },
        usd: { amount: "29900", name: "Premium Execution Sprint" }
      }
    };

    const safePlan = prices[plan] ? plan : "deep_report";
    const safeCurrency = prices[safePlan][currency] ? currency : "php";
    const selected = prices[safePlan][safeCurrency];

    const body = new URLSearchParams({
      mode: "payment",
      success_url: `${origin}/?paid=success`,
      cancel_url: `${origin}/?paid=cancelled`,
      "line_items[0][price_data][currency]": safeCurrency,
      "line_items[0][price_data][product_data][name]": selected.name,
      "line_items[0][price_data][unit_amount]": selected.amount,
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
  } catch (err) {
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
}
