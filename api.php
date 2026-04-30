<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  exit;
}

$apiKey = getenv("OPENAI_API_KEY");

if (!$apiKey) {
  echo json_encode(["error" => "Missing OPENAI_API_KEY on server."]);
  exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$business = $input["business"] ?? "";

if (trim($business) === "") {
  echo json_encode(["error" => "Please describe your agency situation."]);
  exit;
}

$prompt = "
You are FLOW, an AI-powered operating system by Clarity Systems.

Founder: Richard Sy.
Company: Clarity Systems.
Target: scaling marketing agencies with 5–20 clients.

Analyze this agency situation:
$business

Return clear sections:
1. Executive Summary
2. AI Diagnosis
3. Sales System
4. Marketing System
5. Operations System
6. Production Workflow
7. SOP Recommendations
8. KPI Dashboard
9. Revenue, Profit & Loss Notes
10. SWOT Analysis
11. Target Market
12. Segmentation
13. Positioning
14. USP / Unique Selling Proposition
15. COO Approval Notes
16. 7-Day Action Plan

Use simple business language. Be practical, concise, and premium.
Do not give legal, financial, or accounting advice. Add disclaimer that this is operational guidance only.
";

$data = [
  "model" => "gpt-4.1-mini",
  "input" => $prompt,
  "temperature" => 0.4
];

$ch = curl_init("https://api.openai.com/v1/responses");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "Authorization: Bearer " . $apiKey
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
  echo json_encode(["error" => $error]);
  exit;
}

$result = json_decode($response, true);
$text = $result["output"][0]["content"][0]["text"] ?? "No output generated.";

echo json_encode(["result" => $text]);
?>