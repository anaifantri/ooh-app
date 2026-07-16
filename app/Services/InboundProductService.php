<?php

namespace App\Services;

use App\Repositories\InboundProductRepository;

class InboundProductService
{
    private $inboundProductRepository;

    public function __construct(InboundProductRepository $inboundProductRepository)
    {
        $this->inboundProductRepository = $inboundProductRepository;
    }

    public function getByInboundAndProduct(int $inboundId, int $productId)
    {
        $product = $this->inboundProductRepository->getByInboundAndProduct($inboundId, $productId);
            
        return $product;
    }

    public function getInboundProducts(int $inboundId)
    {
        $products = $this->inboundProductRepository->getInboundProducts($inboundId);
            
        return $products;
    }

    // public function updateWarehouseProductStock(int $warehouseId, int $productId, int $stock)
    // {
    //     $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);

    //     $warehouse->products()->updateExistingPivot($productId, [
    //         'stock' => $stock,
    //     ]);
    // }
}