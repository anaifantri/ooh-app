<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $guarded = ['id'];

    public function product_category(){
        return $this->belongsTo(ProductCategory::class);
    }

    public function warehouses()
    {
        return $this->belongsToMany(Warehouse::class, 'warehouse_products')
        ->withPivot('stock')
        ->withTimestamps();
    }

    public function inbound_transactions()
    {
        return $this->belongsToMany(InboundTransaction::class, 'inbound_transaction_products')
        ->withPivot(['qty', 'price'])
        ->withTimestamps();
    }

    public function purchase_requests()
    {
        return $this->belongsToMany(PurchaseRequest::class, 'request_products')
        ->withPivot(['request_qty','po_qty'])
        ->withTimestamps();
    }

    public function purchase_orders()
    {
        return $this->belongsToMany(PurchaseOrder::class, 'request_products')
        ->withPivot(['qty', 'price'])
        ->withTimestamps();
    }

    public function inbounds()
    {
        return $this->belongsToMany(Inbound::class, 'inbound_products')
        ->withPivot(['qty'])
        ->withTimestamps();
    }

    public function warehouse_products(){
        return $this->hasMany(WarehouseProduct::class, 'product_id', 'id');
    }

    public function inbound_transaction_products(){
        return $this->hasMany(InboundTransactionProduct::class, 'product_id', 'id');
    }

    public function inbound_products(){
        return $this->hasMany(InboundProduct::class, 'product_id', 'id');
    }

    public function request_products(){
        return $this->hasMany(RequestProduct::class, 'product_id', 'id');
    }

    public function order_products(){
        return $this->hasMany(OrderProduct::class, 'product_id', 'id');
    }

    public function getWarehouseProductStock() {
        return $this->warehouses()->sum('stock');
    }

    public function getPhotoAttribute($value){
        if(!$value){
            return null;
        }
        return url(Storage::url($value));
    }
}
