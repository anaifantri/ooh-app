<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository
{
    public function getAll(array $fields){
        return Supplier::select($fields)->with('supplier_category')->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return Supplier::select($fields)->with('supplier_category')->findOrFail($id);
    }

    public function getLastSupplierByCategory(array $fields, int $supplierCategoryId){
        return Supplier::select($fields)->where('supplier_category_id', $supplierCategoryId)->with('supplier_category')->orderBy('code', 'desc')->first();
    }

    public function create(array $data){
        return Supplier::create($data);
    }

    public function update(int $id, array $data){
        $supplier = Supplier::findOrFail($id);

        $supplier->update($data);

        return $supplier;
    }

    public function delete(int $id){
        $supplier = Supplier::findOrFail($id);

        $supplier->delete();
    }
}