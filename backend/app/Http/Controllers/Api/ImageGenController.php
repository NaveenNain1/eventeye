<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ImageGenController extends Controller
{
    //
    public function generate(Request $request){
        $request->validate([
            'prompt'=>'required|string|max:225'
        ]);
      
$apiKey = env('GEMINI_API_KEY');
$model = "gemini-2.5-flash-image-preview";
$prompt = "create a certificate formate for a hackathon, 
Keep Student name, hackathon id, blank
User prompt: ".$request->prompt;

// Gemini API endpoint
$url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $prompt]
            ]
        ]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "x-goog-api-key: {$apiKey}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$responseRaw = curl_exec($ch);
curl_close($ch);

$response = json_decode($responseRaw, true);

// Extract inlineData
$imageB64 = null;
$mimeType = "image/png";

if (isset($response['candidates'][0]['content']['parts'])) {
    foreach ($response['candidates'][0]['content']['parts'] as $part) {
        if (isset($part['inlineData']['data'])) {
            $imageB64 = $part['inlineData']['data'];
            $mimeType = $part['inlineData']['mimeType'] ?? "image/png";
            break;
        }
    }
}
return response()->json([
    'base64'=>$imageB64
]);
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>Gemini Image Demo</title>
// </head>
// <body>
//     <h1>Generated Image</h1>
//     <?php if ($imageB64):
//         <img src="data:<?= $mimeType;base64,<?= $imageB64 
// 
// </body>
// </html>

    }
}
