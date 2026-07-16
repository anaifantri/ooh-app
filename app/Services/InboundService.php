<?php

namespace App\Services;

use App\Repositories\InboundRepository;

class InboundService
{
    private $inboundRepository;

    public function __construct(InboundRepository $inboundRepository)
    {
        $this->inboundRepository = $inboundRepository;
    }

    public function getAll(array $fields)
    {
        return $this->inboundRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->inboundRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        $month = now()->format('m');
        $year = now()->year;
        $lastInbound = $this->inboundRepository->getLastInbound();
        if(!$lastInbound){
            $number = 1;
        }else{
            $number = (int) substr($lastInbound->number, 9) + 1;
        }
        $newNumber = 'RC-'. $year . $month . str_pad($number, 5, '0', STR_PAD_LEFT);

        $data['number'] = $newNumber;

        return $this->inboundRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id'];
        $inbound = $this->inboundRepository->getById($id, $fields);

        return $this->inboundRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id'];
        $inbound = $this->inboundRepository->getById($id, $fields);

        return $this->inboundRepository->delete($id);
    }
    
    public function attachProduct(int $inboundId, int $productId, int $qty)
    {
        $inbound = $this->inboundRepository->getById($inboundId, ['id']);

        $inbound->products()->syncWithoutDetaching([
            $productId => ['qty' => $qty]
        ]);
    }
    
    public function updateProduct(int $inboundId, array $products)
    {
        $inbound = $this->inboundRepository->getById($inboundId, ['id']);
        $sync_products = [];
        for($i = 0; $i < count($products); $i++){
            $sync_products[$products[$i]['id']] = ['qty' => $products[$i]['qty']];
        }

        $inbound->products()->sync($sync_products);
    }
}