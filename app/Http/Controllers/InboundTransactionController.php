<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Services\WarehouseService;
use Illuminate\Support\Facades\Storage;
use App\Services\WarehouseProductService;
use App\Services\InboundTransactionService;
use App\Http\Requests\InboundTransactionRequest;
use App\Http\Resources\InboundTransactionResource;
use App\Services\InboundTransactionProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InboundTransactionController extends Controller
{
    private $inboundTransactionService;
    private $warehouseService;
    private $warehouseProductService;
    private $inboundTransactionProductService;

    public function __construct(InboundTransactionService $inboundTransactionService, WarehouseService $warehouseService, WarehouseProductService $warehouseProductService, InboundTransactionProductService $inboundTransactionProductService){
        $this->inboundTransactionService = $inboundTransactionService;
        $this->warehouseService = $warehouseService;
        $this->warehouseProductService = $warehouseProductService;
        $this->inboundTransactionProductService = $inboundTransactionProductService;
    }

    public function index()
    {
        $fields = ['id', 'number', 'user_id', 'supplier_id', 'warehouse_id', 'date', 'sub_total', 'tax', 'grand_total', 'note', 'receipt'];

        $inbound_transactions = $this->inboundTransactionService->getAll($fields);

        return response()->json(InboundTransactionResource::collection($inbound_transactions));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'number', 'user_id', 'supplier_id', 'warehouse_id', 'date', 'sub_total', 'tax', 'grand_total', 'note', 'receipt'];

            $inbound_transaction = $this->inboundTransactionService->getById($id, $fields);

            return response()->json(new InboundTransactionResource($inbound_transaction));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Inbound transaction not found'
            ], 404);
        }
    }

    public function store(InboundTransactionRequest $request)
    {
        $inbound_transaction = $this->inboundTransactionService->create($request->validated());
        
        foreach ($request->products as $product) {
            $this->inboundTransactionService->attachProduct($inbound_transaction->id, $product['id'], $product['qty'], $product['price']);

            $oldStock = $this->warehouseProductService->getWarehouseProductStock($request->warehouse_id, $product['id']);
            
            if($oldStock){
                $newStock = $oldStock + $product['qty'];
                $this->warehouseProductService->updateWarehouseProductStock(
                    $request->warehouse_id,
                    $product['id'],
                    $newStock
                );
            }else{
                $this->warehouseService->attachProduct(
                    $request->warehouse_id,
                    $product['id'],
                    $product['qty']
                );
            }
        }

        return response()->json(new InboundTransactionResource([
            'inbound_tansaction' => $inbound_transaction
            ]), 201);
    }

    public function update(InboundTransactionRequest $request, int $id)
    {
        try {
            // Update Inbound Transaction and Inbound Transaction Products
            $inbound_transaction = $this->inboundTransactionService->update($id, $request->validated());

            // Update Warehouse Product Stock if product deleted from Inbound Transaction Product
            $oldInboundTransactionProducts = $this->inboundTransactionProductService->getInboundTransactionProducts($id);
            foreach ($oldInboundTransactionProducts as $oldInboundTransactionProduct) {
                $found = false;
                foreach ($request->products as $requestProduct) {
                    if($requestProduct['id'] == $oldInboundTransactionProduct->product_id){
                        $found = true;
                    }
                }

                if($found == false){
                    $oldWarehouseProductStock = $this->warehouseProductService->getWarehouseProductStock($request->warehouse_id, $oldInboundTransactionProduct->product_id);
                    $newWarehouseProductStock = $oldWarehouseProductStock - $oldInboundTransactionProduct->qty;

                    $this->warehouseProductService->updateWarehouseProductStock(
                        $request->warehouse_id,
                        $oldInboundTransactionProduct->product_id,
                        $newWarehouseProductStock
                    );
                }
            }

            // Update Warehouse Product Stock if adding new products or updating product qty
            foreach ($request->products as $product) {
                $oldProduct = $this->inboundTransactionProductService->getByInboundTransactionAndProduct($id, $product['id']);
                if($oldProduct){
                    // Update Warehouse Product Stock
                    $oldWarehouseProductStock = $this->warehouseProductService->getWarehouseProductStock($request->warehouse_id, $product['id']);
                    $newWarehouseProductStock = $oldWarehouseProductStock;
                    if($oldProduct->qty > $product['qty']){
                        $diffQty = $oldProduct->qty - $product['qty'];
                        $newWarehouseProductStock = $oldWarehouseProductStock - $diffQty;
                    }elseif($oldProduct->qty < $product['qty']){
                        $diffQty = $product['qty'] - $oldProduct->qty;
                        $newWarehouseProductStock = $oldWarehouseProductStock + $diffQty;
                    }
                    $this->warehouseProductService->updateWarehouseProductStock(
                        $request->warehouse_id,
                        $product['id'],
                        $newWarehouseProductStock
                    );
                }else{
                    // Add New Warehouse Product
                    $this->warehouseService->attachProduct(
                        $request->warehouse_id,
                        $product['id'],
                        $product['qty']
                    );
                }
            }
            
            $this->inboundTransactionService->updateProduct($id, $request->products);

            return response()->json(new InboundTransactionResource($inbound_transaction));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Inbound transaction not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $fields = ['id','warehouse_id', 'receipt'];

            $inbound_transaction = $this->inboundTransactionService->getById($id, $fields);
            $inboundTransactionProducts = $this->inboundTransactionProductService->getInboundTransactionProducts($id);
            foreach ($inboundTransactionProducts as $product) {
                $warehouseProductStock = $this->warehouseProductService->getWarehouseProductStock($inbound_transaction->warehouse_id, $product->product_id);
                $newWarehouseProductStock = $warehouseProductStock - $product->qty;

                $this->warehouseProductService->updateWarehouseProductStock(
                    $inbound_transaction->warehouse_id,
                    $product->product_id,
                    $newWarehouseProductStock
                );
            }

            $inbound_transaction->products()->detach();
            $this->inboundTransactionService->delete($id);
            return response()->json([
                'message' => 'Inbound transaction delete successfuly'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Inbound transaction not found'
            ], 404);
        }
    }
}
