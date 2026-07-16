<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    public function getAll(array $fields){
        return Product::select($fields)->with('warehouses')->with('product_category')->orderBy('code', 'asc')->paginate(10);
    }

    public function getLastProductByCategory(array $fields, int $productCategoryId){
        return Product::select($fields)->where('product_category_id', $productCategoryId)->with('product_category')->orderBy('code', 'desc')->first();
    }

    public function getById(int $id, array $fields){
        return Product::select($fields)->with('warehouses')->with('product_category')->with('inbound_transactions')->findOrFail($id);
    }

    public function create(array $data){
        return Product::create($data);
    }

    public function update(int $id, array $data){
        $product = Product::findOrFail($id);

        $product->update($data);

        return $product;
    }

    public function delete(int $id){
        $product = Product::findOrFail($id);

        $product->delete();
    }
}