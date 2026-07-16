<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    protected $guarded = ['id'];

    public function getLogo($value){
        if(!value){
            return null;
        }
        return url(Storage::url($value));
    }
    
    public function getLogoAttribute($value){
        if(!$value){
            return null;
        }
        return url(Storage::url($value));
    }
}
