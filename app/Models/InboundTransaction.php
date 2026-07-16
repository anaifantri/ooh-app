<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class InboundTransaction extends Model
{
    protected $guarded = ['id'];
    
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function supplier(){
        return $this->belongsTo(Supplier::class);
    }
    
    public function warehouse(){
        return $this->belongsTo(Warehouse::class);
    }
    
    public function products()
    {
        return $this->belongsToMany(Product::class, 'inbound_transaction_products')
        ->withPivot(['qty', 'price'])
        ->withTimestamps();
    }
    
    public function inbound_transaction_products(){
        return $this->hasMany(InboundTransactionProduct::class, 'inbound_transaction_id', 'id');
    }

    public function getReceiptAttribute($value){
        if(!$value){
            return null;
        }
        return url(Storage::url($value));
    }
}
