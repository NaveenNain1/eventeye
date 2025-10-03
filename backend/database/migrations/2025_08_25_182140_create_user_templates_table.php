<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_templates', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("category");
            $table->string("language");
            $table->longtext("canvas")->nullable();
              $table->foreignId('user_id')
                  ->constrained('users') // references `id` on `users` table
                  ->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_templates');
    }
};
