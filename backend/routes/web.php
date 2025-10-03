<?php

use App\Services\OllamaService;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $ollama = new OllamaService();

    // Example: generate text from model
    $response = $ollama->generate('llama3', 'Hello from Laravel to Ollama!');

    return response()->json($response);
});
