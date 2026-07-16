<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inbound extends Model
{
    protected $guarded = ['id'];
    
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function purchase_order(){
        return $this->belongsTo(PurchaseOrder::class);
    }
    
    public function warehouse(){
        return $this->belongsTo(Warehouse::class);
    }
    
    public function products()
    {
        return $this->belongsToMany(Product::class, 'inbound_products')
        ->withPivot(['qty'])
        ->withTimestamps();
    }
    
    public function inbound_products(){
        return $this->hasMany(InboundProduct::class, 'inbound_id', 'id');
    }
}
