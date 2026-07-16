<?php

namespace App\Services;

use App\Repositories\ProductCategoryRepository;

class ProductCategoryService
{
    private $productCategoryRepository;

    public function __construct(ProductCategoryRepository $productCategoryRepository){
        $this->productCategoryRepository = $productCategoryRepository;
    }

    public function getAll(array $fields)
    {
        return $this->productCategoryRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->productCategoryRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        return $this->productCategoryRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'name', 'code', 'description'];
        $product_category = $this->productCategoryRepository->getById($id, $fields);

        return $this->productCategoryRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'name', 'code', 'description'];
        $product_category = $this->productCategoryRepository->getById($id, $fields);

        return $this->productCategoryRepository->delete($id);
    }
}