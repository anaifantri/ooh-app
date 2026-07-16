<?php

namespace App\Services;

use App\Repositories\WarehouseRepository;
use App\Repositories\InboundTransactionProductRepository;

class InboundTransactionProductService
{
    private $inboundTransactionProductRepository;

    public function __construct(InboundTransactionProductRepository $inboundTransactionProductRepository)
    {
        $this->inboundTransactionProductRepository = $inboundTransactionProductRepository;
    }

    public function getByInboundTransactionAndProduct(int $inboundTransactionId, int $productId)
    {
        $product = $this->inboundTransactionProductRepository->getByInboundTransactionAndProduct($inboundTransactionId, $productId);
            
        return $product;
    }

    public function getInboundTransactionProducts(int $inboundTransactionId)
    {
        $products = $this->inboundTransactionProductRepository->getInboundTransactionProducts($inboundTransactionId);
            
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