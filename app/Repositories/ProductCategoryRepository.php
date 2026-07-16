<?php

namespace App\Repositories;

use App\Models\ProductCategory;

class ProductCategoryRepository
{
    public function getAll(array $fields){
        return ProductCategory::select($fields)->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return ProductCategory::select($fields)->findOrFail($id);
    }

    public function create(array $data){
        return ProductCategory::create($data);
    }

    public function update(int $id, array $data){
        $product_category = ProductCategory::findOrFail($id);

        $product_category->update($data);

        return $product_category;
    }

    public function delete(int $id){
        $product_category = ProductCategory::findOrFail($id);

        $product_category->delete();
    }

}