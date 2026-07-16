<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InboundProduct extends Model
{
    protected $guarded = ['id'];

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function inbound(){
        return $this->belongsTo(Inbound::class);
    }
}
