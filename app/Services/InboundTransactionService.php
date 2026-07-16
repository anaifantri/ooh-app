<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use App\Repositories\InboundTransactionRepository;
use Illuminate\Support\Facades\Storage;

class InboundTransactionService
{
    private $inboundTransactionRepository;

    public function __construct(InboundTransactionRepository $inboundTransactionRepository)
    {
        $this->inboundTransactionRepository = $inboundTransactionRepository;
    }

    public function getAll(array $fields)
    {
        return $this->inboundTransactionRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->inboundTransactionRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        if (isset($data['receipt']) && $data['receipt'] instanceof UploadedFile){
            $data['receipt'] = $this->uploadPhoto($data['receipt']);
        }

        return $this->inboundTransactionRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'receipt'];
        $inboundTransaction = $this->inboundTransactionRepository->getById($id, $fields);

        if (isset($data['receipt']) && $data['receipt'] instanceof UploadedFile){
            if(!empty($inboundTransaction->receipt)){
                $this->deletePhoto($inboundTransaction->receipt);
            }

            $data['receipt'] = $this->uploadPhoto($data['receipt']);
        }

        return $this->inboundTransactionRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'receipt'];
        $inboundTransaction = $this->inboundTransactionRepository->getById($id, $fields);

        if ($inboundTransaction->receipt){
            $this->deletePhoto($inboundTransaction->receipt);
        }

        return $this->inboundTransactionRepository->delete($id);
    }
    
    public function attachProduct(int $inboundTransactionId, int $productId, int $qty, int $price)
    {
        $inboundTransaction = $this->inboundTransactionRepository->getById($inboundTransactionId, ['id']);

        $inboundTransaction->products()->syncWithoutDetaching([
            $productId => ['qty' => $qty, 'price' => $price]
        ]);
    }
    
    public function updateProduct(int $inboundTransactionId, array $products)
    {
        $inboundTransaction = $this->inboundTransactionRepository->getById($inboundTransactionId, ['id']);
        $sync_products = [];
        for($i = 0; $i < count($products); $i++){
            $sync_products[$products[$i]['id']] = ['qty' => $products[$i]['qty'], 'price' => $products[$i]['price']];
        }

        $inboundTransaction->products()->sync($sync_products);
    }

    private function uploadPhoto(UploadedFile $receipt)
    {
        return $receipt->store('inbound-transaction-receipt', 'public');
    }

    private function deletePhoto(string $receiptPath)
    {
        $relativePath = 'inbound-transaction-receipt/'. basename($receiptPath);
        if(Storage::disk('public')->exists($relativePath)){
            Storage::disk('public')->delete($relativePath);
        }
    }
}