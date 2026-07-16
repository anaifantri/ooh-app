<?php

namespace App\Services;

use App\Repositories\PurchaseRequestRepository;

class PurchaseRequestService
{
    private $purchaseRequestRepository;

    public function __construct(PurchaseRequestRepository $purchaseRequestRepository)
    {
        $this->purchaseRequestRepository = $purchaseRequestRepository;
    }

    public function getAll(array $fields)
    {
        return $this->purchaseRequestRepository->getAll($fields);
    }

    public function getOpenRequest(array $fields)
    {
        return $this->purchaseRequestRepository->getOpenRequest($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->purchaseRequestRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        $month = now()->format('m');
        $year = now()->year;
        $lastRequest = $this->purchaseRequestRepository->getLastRequest();
        if(!$lastRequest){
            $number = 1;
        }else{
            $number = (int) substr($lastRequest->number, 9) + 1;
        }
        $newNumber = 'PR-'. $year . $month . str_pad($number, 5, '0', STR_PAD_LEFT);

        $data['number'] = $newNumber;
        return $this->purchaseRequestRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id'];
        $purchaseRequest = $this->purchaseRequestRepository->getById($id, $fields);

        return $this->purchaseRequestRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id'];
        $purchaseRequest = $this->purchaseRequestRepository->getById($id, $fields);

        return $this->purchaseRequestRepository->delete($id);
    }
    
    public function attachProduct(int $purchaseRequestId, int $productId, int $request_qty, int $po_qty)
    {
        $purchaseRequest = $this->purchaseRequestRepository->getById($purchaseRequestId, ['id']);

        $purchaseRequest->products()->syncWithoutDetaching([
            $productId => [
                'request_qty' => $request_qty,
                'po_qty' => $po_qty
                ]
        ]);
    }
    
    public function updateProduct(int $purchaseRequestId, array $products)
    {
        $purchaseRequest = $this->purchaseRequestRepository->getById($purchaseRequestId, ['id']);
        $sync_products = [];
        for($i = 0; $i < count($products); $i++){
            $sync_products[$products[$i]['id']] = [
                'request_qty' => $products[$i]['request_qty'],
                'po_qty' => $products[$i]['po_qty']
                ];
        }

        $purchaseRequest->products()->sync($sync_products);
    }

    public function updatePoQty(int $purchaseRequestId, array $products)
    {
        $purchaseRequest = $this->purchaseRequestRepository->getById($purchaseRequestId, ['id']);
        $sync_products = [];
        for($i = 0; $i < count($products); $i++){
            $sync_products[$products[$i]['id']] = [
                'po_qty' => $products[$i]['qty']
                ];
        }

        $purchaseRequest->products()->syncWithoutDetaching($sync_products);
    }
}