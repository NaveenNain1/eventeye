<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCredit extends Model
{
    use HasFactory;

    protected $table = 'user_credits';

    protected $fillable = [
        'remarks',
        'amt',
        'user_id',
    ];

    /**
     * Get the user that owns the credit.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
