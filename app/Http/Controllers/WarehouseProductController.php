<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Services\WarehouseService;
use App\Http\Resources\WarehouseProductResource;
use App\Http\Requests\WarehouseProductRequest;

class WarehouseProductController extends Controller
{
    private $warehouseService;

    public function __construct(WarehouseService $warehouseService){
        $this->warehouseService = $warehouseService;
    }

    public function attach(WarehouseProductRequest $request, int $warehouseId)
    {
        // $request->validated();
        $this->warehouseService->attachProduct(
            $warehouseId,
            $request->validated()['product_id'],
            $request->validated()['stock']
        );

        return response()->json([
            'message' => 'Product attached successfuly'
        ]);
    }

    public function detach(int $warehouseId, int $productId)
    {
        $this->warehouseService->detachProduct(
            $warehouseId,
            $productId
        );

        return response()->json([
            'message' => 'Product detached successfuly'
        ]);
    }
    public function update(Request $request, int $warehouseId, int $productId)
    {
        $request->validate([
            'stock' => 'required|integer|min:1'
        ]);
        $warehouseProduct = $this->warehouseService->updateProductStock(
            $warehouseId,
            $productId,
            $request->input('stock')
        );

        return response()->json([
            'message' => 'Stock updated successfuly',
            'data' => $warehouseProduct,
        ]);
    }
}
