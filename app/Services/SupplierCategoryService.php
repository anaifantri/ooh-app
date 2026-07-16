<?php

namespace App\Services;

use App\Repositories\SupplierCategoryRepository;

class SupplierCategoryService
{
    private $supplierCategoryRepository;

    public function __construct(SupplierCategoryRepository $supplierCategoryRepository){
        $this->supplierCategoryRepository = $supplierCategoryRepository;
    }

    public function getAll(array $fields)
    {
        return $this->supplierCategoryRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->supplierCategoryRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        return $this->supplierCategoryRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'name', 'description'];
        $supplier_category = $this->supplierCategoryRepository->getById($id, $fields);

        return $this->supplierCategoryRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'name', 'description'];
        $supplier_category = $this->supplierCategoryRepository->getById($id, $fields);

        return $this->supplierCategoryRepository->delete($id);
    }
}