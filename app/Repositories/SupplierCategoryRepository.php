<?php

namespace App\Repositories;

use App\Models\SupplierCategory;

class SupplierCategoryRepository
{
    public function getAll(array $fields){
        return SupplierCategory::select($fields)->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return SupplierCategory::select($fields)->findOrFail($id);
    }

    public function create(array $data){
        return SupplierCategory::create($data);
    }

    public function update(int $id, array $data){
        $supplier_category = SupplierCategory::findOrFail($id);

        $supplier_category->update($data);

        return $supplier_category;
    }

    public function delete(int $id){
        $supplier_category = SupplierCategory::findOrFail($id);

        $supplier_category->delete();
    }

}