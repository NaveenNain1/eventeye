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
        Schema::create('user_projects', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->string("aititle");
            $table->longtext("summary");
            $table->longtext("keywords");
            $table->longtext("caption");
            $table->longtext("image_path")->nullable();

            $table->longtext("captionBased")->nullable();
            $table->longtext("subcategory")->nullable();
            $table->longtext("main_category")->nullable();
            $table->longtext("image_query")->nullable();
 
              $table->foreignId('user_id')
                  ->constrained('users')  
                  ->onDelete('cascade');

                    $table->foreignId('user_template_id')
                  ->constrained('user_templates')  
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_projects');
    }
};
