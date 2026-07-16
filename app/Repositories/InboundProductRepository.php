<?php

namespace App\Repositories;

use App\Models\InboundProduct;

class InboundProductRepository
{
    public function getByInboundAndProduct(int $inboundId, int $productId)
    {
        return InboundProduct::where('inbound_id', $inboundId)->where('product_id', $productId)->first();
    }

    public function getInboundProducts(int $inboundId)
    {
        return InboundProduct::where('inbound_id', $inboundId)->get();
    }
}