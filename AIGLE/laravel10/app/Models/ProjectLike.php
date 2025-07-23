<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectLike extends Model
{
    protected $fillable = ['project_id', 'user_id'];
}
