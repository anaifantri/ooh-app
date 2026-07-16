<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $guarded = ['id'];
    
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function supplier(){
        return $this->belongsTo(Supplier::class);
    }
    
    public function purchase_request(){
        return $this->belongsTo(PurchaseRequest::class);
    }
    
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_products')
        ->withPivot(['qty', 'price'])
        ->withTimestamps();
    }
    
    public function order_products(){
        return $this->hasMany(OrderProduct::class, 'purchase_order_id', 'id');
    }
}
