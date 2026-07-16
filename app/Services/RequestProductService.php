<?php

namespace App\Services;

use App\Repositories\RequestProductRepository;

class RequestProductService
{
    private $requestProductRepository;

    public function __construct(RequestProductRepository $requestProductRepository)
    {
        $this->requestProductRepository = $requestProductRepository;
    }

    public function getByPurchaseRequestAndProduct(int $purchaseRequestId, int $productId)
    {
        $product = $this->requestProductRepository->getByPurchaseRequestAndProduct($purchaseRequestId, $productId);
            
        return $product;
    }

    public function getRequestProducts(int $purchaseRequestId)
    {
        $products = $this->requestProductRepository->getRequestProducts($purchaseRequestId);
            
        return $products;
    }
}