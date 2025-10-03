<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OllamaService
{
    protected $baseUrl;

    public function __construct()
    {
        // Change this to your server's public IP or domain
        $this->baseUrl = env('OLLAMA_API_URL', 'http://35.212.62.127:11434/api');
    }

    /**
     * Get available models
     */
    public function getModels()
    {
        $response = Http::get("{$this->baseUrl}/tags");

        if ($response->successful()) {
            return $response->json();
        }

        return ['error' => $response->body()];
    }

    /**
     * Generate text from a model
     */
    public function generate($model, $prompt)
    {
        // return $model;
        $response = Http::timeout(0)->post("{$this->baseUrl}/generate", [
            'model'  => $model,
            'prompt' => $prompt,
            'stream' => false
        ]);

         if ($response->successful()) {
            $json = $response->json();
            return $json['response'] ?? ''; // only return generated text
        }

        return ['error' => $response->body()];
    }
    
}
