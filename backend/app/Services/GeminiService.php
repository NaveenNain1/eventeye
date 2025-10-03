<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY'); // put your key in .env
        $this->baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    }

    /**
     * Generate text from Gemini Flash model
     */
    public function generate($model = "gemini-1.5-flash", $prompt)
    {
        $url = "{$this->baseUrl}/models/{$model}:generateContent?key={$this->apiKey}";

        $response = Http::post($url, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if ($response->successful()) {
            $json = $response->json();
            return $json['candidates'][0]['content']['parts'][0]['text'] ?? ''; 
        }

        return ['error' => $response->body()];
    }
}
