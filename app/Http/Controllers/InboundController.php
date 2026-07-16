<?php

namespace App\Http\Controllers;

use App\Http\Requests\InboundRequest;
use App\Http\Resources\InboundResource;
use App\Services\InboundProductService;
use App\Services\InboundService;
use App\Services\WarehouseProductService;
use App\Services\WarehouseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InboundController extends Controller
{
    private $inboundService;
    private $warehouseService;
    private $warehouseProductService;
    private $inboundProductService;

    public function __construct(InboundService $inboundService, WarehouseService $warehouseService, WarehouseProductService $warehouseProductService, InboundProductService $inboundProductService){
        $this->inboundService = $inboundService;
        $this->warehouseService = $warehouseService;
        $this->warehouseProductService = $warehouseProductService;
        $this->inboundProductService = $inboundProductService;
    }

    public function index()
    {
        $fields = ['id', 'number', 'user_id', 'purchase_order_id', 'warehouse_id', 'date', 'created_at'];

        $inbounds = $this->inboundService->getAll($fields);

        return response()->json(InboundResource::collection($inbounds));
    }
    
    public function show(int $id){
        try {
            $fields = ['id', 'number', 'user_id', 'purchase_order_id', 'warehouse_id', 'date', 'created_at'];

            $inbound = $this->inboundService->getById($id, $fields);

            return response()->json(new InboundResource($inbound));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Inbound not found'
            ], 404);
        }
    }

    public function store(InboundRequest $request)
    {
        $inbound = $this->inboundService->create($request->validated());
        
        foreach ($request->products as $product) {
            $this->inboundService->attachProduct($inbound->id, $product['id'], $product['qty']);

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

        return response()->json(new InboundResource([
            'inbound_tansaction' => $inbound
            ]), 201);
    }

    public function update(InboundRequest $request, int $id)
    {
        try {
            // Update Inbound and Inbound Products
            $inbound = $this->inboundService->update($id, $request->validated());

            // Update Warehouse Product Stock if product deleted from Inbound Product
            $oldInboundProducts = $this->inboundProductService->getInboundProducts($id);
            foreach ($oldInboundProducts as $oldInboundProduct) {
                $found = false;
                foreach ($request->products as $requestProduct) {
                    if($requestProduct['id'] == $oldInboundProduct->product_id){
                        $found = true;
                    }
                }

                if($found == false){
                    $oldWarehouseProductStock = $this->warehouseProductService->getWarehouseProductStock($request->warehouse_id, $oldInboundProduct->product_id);
                    $newWarehouseProductStock = $oldWarehouseProductStock - $oldInboundProduct->qty;

                    $this->warehouseProductService->updateWarehouseProductStock(
                        $request->warehouse_id,
                        $oldInboundProduct->product_id,
                        $newWarehouseProductStock
                    );
                }
            }

            // Update Warehouse Product Stock if adding new products or updating product qty
            foreach ($request->products as $product) {
                $oldProduct = $this->inboundProductService->getByInboundAndProduct($id, $product['id']);
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
            
            $this->inboundService->updateProduct($id, $request->products);

            return response()->json(new InboundResource($inbound));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Inbound not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $fields = ['id','warehouse_id'];

            $inbound = $this->inboundService->getById($id, $fields);
            $inboundProducts = $this->inboundProductService->getInboundProducts($id);
            foreach ($inboundProducts as $product) {
                $warehouseProductStock = $this->warehouseProductService->getWarehouseProductStock($inbound->warehouse_id, $product->product_id);
                $newWarehouseProductStock = $warehouseProductStock - $product->qty;

                $this->warehouseProductService->updateWarehouseProductStock(
                    $inbound->warehouse_id,
                    $product->product_id,
                    $newWarehouseProductStock
                );
            }

            $inbound->products()->detach();
            $this->inboundService->delete($id);
            return response()->json([
                'message' => 'Inbound delete successfuly'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Inbound not found'
            ], 404);
        }
    }
}
