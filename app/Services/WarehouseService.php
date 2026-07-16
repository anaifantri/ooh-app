<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use App\Repositories\WarehouseRepository;
use Illuminate\Support\Facades\Storage;

class WarehouseService
{
    private $warehouseRepository;

    public function __construct(WarehouseRepository $warehouseRepository)
    {
        $this->warehouseRepository = $warehouseRepository;
    }

    public function getAll(array $fields)
    {
        return $this->warehouseRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->warehouseRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile){
            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->warehouseRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'photo'];
        $warehouse = $this->warehouseRepository->getById($id, $fields);

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile){
            if(!empty($warehouse->photo)){
                $this->deletePhoto($warehouse->photo);
            }

            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->warehouseRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'photo'];
        $warehouse = $this->warehouseRepository->getById($id, $fields);

        if ($warehouse->photo){
            $this->deletePhoto($warehouse->photo);
        }

        return $this->warehouseRepository->delete($id);
    }

    public function attachProduct(int $warehouseId, int $productId, int $stock)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);

        $warehouse->products()->syncWithoutDetaching([
            $productId => ['stock' => $stock]
        ]);
    }

    public function updateProductStock(int $warehouseId, int $productId, int $stock)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);

        $warehouse->products()->updateExistingPivot($productId, [
            'stock' => $stock,
        ]);

        return $warehouse->products()->where('product_id', $productId)->first();
    }

    public function detachProduct(int $warehouseId, int $productId)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);

        $warehouse->products()->detach($productId);
    }

    private function uploadPhoto(UploadedFile $photo)
    {
        return $photo->store('warehouse-photo', 'public');
    }

    private function deletePhoto(string $photoPath)
    {
        $relativePath = 'warehouse-photo/'. basename($photoPath);
        if(Storage::disk('public')->exists($relativePath)){
            Storage::disk('public')->delete($relativePath);
        }
    }
}