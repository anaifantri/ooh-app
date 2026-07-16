<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $guarded = ['id'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function supplier_category(){
        return $this->belongsTo(SupplierCategory::class);
    }
    
    public function purchase_orders(){
        return $this->hasMany(PurchaseOrder::class, 'supplier_id', 'id');
    }
}
