<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProject extends Model
{
    use HasFactory;

    protected $table = 'user_projects';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'aititle',
        'summary',
        'keywords','caption',
        'image_path',
        'user_id',
        'user_template_id',
'captionBased',
'subcategory',
        'main_category','image_query'
    ];
    //    $table->longtext("captionBased")->nullable();
    //         $table->longtext("subcategory")->nullable();
    //         $table->longtext("main_category")->nullable();
    //         $table->longtext("image_query")->nullable();
 
    /**
     * Relationships
     */

    // Each project belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Each project belongs to a user template
    public function template()
    {
        return $this->belongsTo(UserTemplate::class, 'user_template_id');
    }
}
