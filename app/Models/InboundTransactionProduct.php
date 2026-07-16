<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InboundTransactionProduct extends Model
{
    protected $guarded = ['id'];

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function inbound_tansaction(){
        return $this->belongsTo(InboundTransaction::class);
    }
}
