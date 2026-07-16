<?php

namespace App\Services;

use App\Repositories\OrderProductRepository;

class OrderProductService
{
    private $orderProductRepository;

    public function __construct(OrderProductRepository $orderProductRepository)
    {
        $this->orderProductRepository = $orderProductRepository;
    }

    public function getByOrderAndProduct(int $purchaseOrderId, int $productId)
    {
        $product = $this->orderProductRepository->getByOrderAndProduct($purchaseOrderId, $productId);
            
        return $product;
    }

    public function getOrderProducts(int $purchaseOrderId)
    {
        $products = $this->orderProductRepository->getOrderProducts($purchaseOrderId);
            
        return $products;
    }
}