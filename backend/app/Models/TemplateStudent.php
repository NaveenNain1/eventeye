<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateStudent extends Model
{
    //
  protected $fillable = [
        'name',
        'certificate_number',
        'email',
        'mobile',
        'remarks',
        'user_template_id','user_id','sent'
    ];
 
    public function userTemplate()
    {
        return $this->belongsTo(UserTemplate::class, 'user_template_id');
    }
}
