<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use App\Repositories\ProductRepository;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(array $fields)
    {
        return $this->productRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->productRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        $lastProduct = $this->productRepository->getLastProductByCategory($fields ?? ['*'], $data['product_category_id']);
        $categoryCode = $data['category_code'];
        if(!$lastProduct){
            $number = 1;
        }else{
            $number = (int) substr($lastProduct->code, 4) + 1;
        }
        $newProductCode = $categoryCode.'-' . str_pad($number, 5, '0', STR_PAD_LEFT);

        $data['code'] = $newProductCode;

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile){
            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->productRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'photo', 'product_category_id', 'code'];
        $product = $this->productRepository->getById($id, $fields);
        if($data['product_category_id'] != $product->product_category_id)
        {
            $lastProduct = $this->productRepository->getLastProductByCategory($fields, $data['product_category_id']);
            $categoryCode = $data['category_code'];
            if(!$lastProduct){
                $number = 1;
            }else{
                $number = (int) substr($lastProduct->code, 4) + 1;
            }
            $newProductCode = $categoryCode.'-' . str_pad($number, 5, '0', STR_PAD_LEFT);

            $data['code'] = $newProductCode;
        }

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile){
            if(!empty($product->photo)){
                $this->deletePhoto($product->photo);
            }

            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->productRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'photo'];
        $product = $this->productRepository->getById($id, $fields);

        if ($product->photo){
            $this->deletePhoto($product->photo);
        }

        return $this->productRepository->delete($id);
    }

    private function uploadPhoto(UploadedFile $photo)
    {
        return $photo->store('product-photo', 'public');
    }

    private function deletePhoto(string $photoPath)
    {
        $relativePath = 'product-photo/'. basename($photoPath);
        if(Storage::disk('public')->exists($relativePath)){
            Storage::disk('public')->delete($relativePath);
        }
    }
}