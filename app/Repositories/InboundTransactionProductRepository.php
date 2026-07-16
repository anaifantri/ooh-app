<?php

namespace App\Repositories;

use App\Models\InboundTransactionProduct;
use Illuminate\Validation\ValidationException;

class InboundTransactionProductRepository
{
    public function getByInboundTransactionAndProduct(int $inboundTransactionId, int $productId)
    {
        return InboundTransactionProduct::where('inbound_transaction_id', $inboundTransactionId)->where('product_id', $productId)->first();
    }

    public function getInboundTransactionProducts(int $inboundTransactionId)
    {
        return InboundTransactionProduct::where('inbound_transaction_id', $inboundTransactionId)->get();
    }
}