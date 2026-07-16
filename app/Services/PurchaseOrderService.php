<?php

namespace App\Services;

use App\Repositories\PurchaseOrderRepository;

class PurchaseOrderService
{
    private $purchaseOrderRepository;

    public function __construct(PurchaseOrderRepository $purchaseOrderRepository)
    {
        $this->purchaseOrderRepository = $purchaseOrderRepository;
    }

    public function getAll(array $fields)
    {
        return $this->purchaseOrderRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->purchaseOrderRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        $month = now()->format('m');
        $year = now()->year;
        $lastOrder = $this->purchaseOrderRepository->getLastOrder();
        if(!$lastOrder){
            $number = 1;
        }else{
            $number = (int) substr($lastOrder->number, 9) + 1;
        }
        $newNumber = 'PO-'. $year . $month . str_pad($number, 5, '0', STR_PAD_LEFT);

        $data['number'] = $newNumber;
        return $this->purchaseOrderRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id'];
        $purchaseOrder = $this->purchaseOrderRepository->getById($id, $fields);

        return $this->purchaseOrderRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id'];
        $purchaseOrder = $this->purchaseOrderRepository->getById($id, $fields);

        return $this->purchaseOrderRepository->delete($id);
    }
    
    public function attachProduct(int $purchaseOrderId, int $productId, int $qty, int $price)
    {
        $purchaseOrder = $this->purchaseOrderRepository->getById($purchaseOrderId, ['id']);

        $purchaseOrder->products()->syncWithoutDetaching([
            $productId => ['qty' => $qty, 'price' => $price]
        ]);
    }
    
    public function updateProduct(int $purchaseOrderId, array $products)
    {
        $purchaseOrder = $this->purchaseOrderRepository->getById($purchaseOrderId, ['id']);
        $sync_products = [];
        for($i = 0; $i < count($products); $i++){
            $sync_products[$products[$i]['id']] = ['qty' => $products[$i]['qty'], 'price' => $products[$i]['price']];
        }

        $purchaseOrder->products()->sync($sync_products);
    }
}