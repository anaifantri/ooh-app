<?php

namespace App\Repositories;

use App\Models\RequestProduct;

class RequestProductRepository
{
    public function getByPurchaseRequestAndProduct(int $purchaseRequestId, int $productId)
    {
        return RequestProduct::where('purchase_request_id', $purchaseRequestId)->where('product_id', $productId)->first();
    }

    public function getRequestProducts(int $purchaseRequestId)
    {
        return RequestProduct::where('purchase_request_id', $purchaseRequestId)->get();
    }
}