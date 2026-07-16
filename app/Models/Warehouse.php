<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Warehouse extends Model
{
    protected $guarded = ['id'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'warehouse_products')
        ->withPivot('stock')
        ->withTimestamps();
    }
    
    public function warehouse_products(){
        return $this->hasMany(WarehouseProduct::class, 'warehouse_id', 'id');
    }

    public function getPhotoAttribute($value){
        if(!$value){
            return null;
        }
        return url(Storage::url($value));
    }
}
