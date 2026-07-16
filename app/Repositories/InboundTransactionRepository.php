<?php

namespace App\Repositories;

use App\Models\InboundTransaction;

class InboundTransactionRepository
{
    public function getAll(array $fields){
        return InboundTransaction::select($fields)->with('products.product_category')->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return InboundTransaction::select($fields)->with('products.product_category')->findOrFail($id);
    }

    public function create(array $data){
        return InboundTransaction::create($data);
    }

    public function update(int $id, array $data){
        $inbound_transaction = InboundTransaction::findOrFail($id);

        $inbound_transaction->update($data);

        return $inbound_transaction;
    }

    public function delete(int $id){
        $inbound_transaction = InboundTransaction::findOrFail($id);

        $inbound_transaction->delete();
    }
}