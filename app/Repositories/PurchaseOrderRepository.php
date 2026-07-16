<?php

namespace App\Repositories;

use App\Models\PurchaseOrder;
use Carbon\Carbon;

class PurchaseOrderRepository
{
    public function getAll(array $fields){
        return PurchaseOrder::select($fields)->with('purchase_request')->with('purchase_request.warehouse')->with('products')->with('order_products')->with('products.product_category')->with('supplier')->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return PurchaseOrder::select($fields)->with('purchase_request')->with('purchase_request.warehouse')->with('purchase_request.products')->with('products')->with('order_products')->with('products.product_category')->with('supplier')->with('user')->findOrFail($id);
    }

    public function getLastOrder(){
        return PurchaseOrder::whereYear('created_at', Carbon::now()->year)
                        ->whereMonth('created_at', Carbon::now()->month)
                        ->orderBy('number', 'desc')->first();
    }

    public function create(array $data){
        return PurchaseOrder::create($data);
    }

    public function update(int $id, array $data){
        $purchase_order = PurchaseOrder::findOrFail($id);

        $purchase_order->update($data);

        return $purchase_order;
    }

    public function delete(int $id){
        $purchase_order = PurchaseOrder::findOrFail($id);

        $purchase_order->delete();
    }
}