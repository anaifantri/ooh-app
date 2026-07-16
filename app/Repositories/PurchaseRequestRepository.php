<?php

namespace App\Repositories;

use App\Models\PurchaseRequest;
use Carbon\Carbon;

class PurchaseRequestRepository
{
    public function getAll(array $fields){
        return PurchaseRequest::select($fields)->with('products.product_category')->with('warehouse')->with('purchase_orders')->with('warehouse')->with('purchase_orders.products')->with('user')->with('products')->with('request_products')->latest()->paginate(10);
    }

    public function getOpenRequest(array $fields){
        return PurchaseRequest::openRequest()->select($fields)->with('products.product_category')->with('warehouse')->with('purchase_orders')->with('warehouse')->with('purchase_orders.products')->with('user')->with('products')->with('request_products')->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return PurchaseRequest::select($fields)->with('products.product_category')->with('warehouse')->with('purchase_orders')->with('warehouse')->with('purchase_orders.products')->with('user')->with('products')->with('request_products')->findOrFail($id);
    }

    public function getLastRequest(){
        return PurchaseRequest::whereYear('created_at', Carbon::now()->year)
                        ->whereMonth('created_at', Carbon::now()->month)
                        ->orderBy('number', 'desc')->first();
    }

    public function create(array $data){
        return PurchaseRequest::create($data);
    }

    public function update(int $id, array $data){
        $purchase_request = PurchaseRequest::findOrFail($id);

        $purchase_request->update($data);

        return $purchase_request;
    }

    public function delete(int $id){
        $purchase_request = PurchaseRequest::findOrFail($id);

        $purchase_request->delete();
    }
}