<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseRequest extends Model
{
    protected $guarded = ['id'];

    public function scopeOpenRequest($query){
        return $query->whereDoesntHave('purchase_orders')
                    ->orWhereHas('products', function ($query) {
                    $query->whereRaw('request_products.po_qty < request_products.request_qty');
                });
    }
    
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function warehouse(){
        return $this->belongsTo(Warehouse::class);
    }
    
    public function products()
    {
        return $this->belongsToMany(Product::class, 'request_products')
        ->withPivot(['request_qty','po_qty'])
        ->withTimestamps();
    }
    
    public function request_products(){
        return $this->hasMany(RequestProduct::class, 'purchase_request_id', 'id');
    }
    
    public function purchase_orders(){
        return $this->hasMany(PurchaseOrder::class, 'purchase_request_id', 'id');
    }
}
