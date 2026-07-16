<?php

namespace App\Repositories;

use App\Models\Inbound;
use Illuminate\Support\Carbon;

class InboundRepository
{
    public function getAll(array $fields){
        return Inbound::select($fields)->with('user')->with('warehouse')->with('purchase_order')->with('purchase_order.products')->with('purchase_order.supplier')->with('products')->with('products.product_category')->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return Inbound::select($fields)->with('user')->with('warehouse')->with('purchase_order')->with('purchase_order.products')->with('purchase_order.supplier')->with('products')->with('products.product_category')->findOrFail($id);
    }

    public function getLastInbound(){
        return Inbound::whereYear('created_at', Carbon::now()->year)
                        ->whereMonth('created_at', Carbon::now()->month)
                        ->orderBy('number', 'desc')->first();
    }

    public function create(array $data){
        return Inbound::create($data);
    }

    public function update(int $id, array $data){
        $inbound = Inbound::findOrFail($id);

        $inbound->update($data);

        return $inbound;
    }

    public function delete(int $id){
        $inbound = Inbound::findOrFail($id);

        $inbound->delete();
    }
}