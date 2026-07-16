<?php

namespace App\Services;

use App\Repositories\WarehouseRepository;
use App\Repositories\WarehouseProductRepository;

class WarehouseProductService
{
    private $warehouseProductRepository;
    private $warehouseRepository;

    public function __construct(WarehouseProductRepository $warehouseProductRepository, WarehouseRepository $warehouseRepository)
    {
        $this->warehouseProductRepository = $warehouseProductRepository;
        $this->warehouseRepository = $warehouseRepository;
    }

    public function getWarehouseProductStock(int $warehouseId, int $productId)
    {
        $warehouse = $this->warehouseProductRepository->getByWarehouseAndProduct($warehouseId, $productId);
        if($warehouse){
            return $warehouse->stock;
        }
    }

    public function updateWarehouseProductStock(int $warehouseId, int $productId, int $stock)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);

        $warehouse->products()->updateExistingPivot($productId, [
            'stock' => $stock,
        ]);
    }
}