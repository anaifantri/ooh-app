<?php

namespace App\Repositories;

use App\Models\OrderProduct;

class OrderProductRepository
{
    public function getByOrderAndProduct(int $purchaseOrderId, int $productId)
    {
        return OrderProduct::where('purchase_order_id', $purchaseOrderId)->where('product_id', $productId)->first();
    }

    public function getOrderProducts(int $purchaseOrderId)
    {
        return OrderProduct::where('purchase_order_id', $purchaseOrderId)->get();
    }
}