<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseRequestRequest;
use App\Http\Resources\PurchaseRequestResource;
use App\Services\PurchaseRequestService;
use App\Services\RequestProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PurchaseRequestController extends Controller
{
    private $purchaseRequestService;
    private $requestProductService;

    public function __construct(PurchaseRequestService $purchaseRequestService, RequestProductService $requestProductService){
        $this->purchaseRequestService = $purchaseRequestService;
        $this->requestProductService = $requestProductService;
    }

    public function index()
    {
        $fields = ['id', 'number', 'user_id', 'request_by', 'warehouse_id', 'note', 'created_at'];

        $purchase_requests = $this->purchaseRequestService->getAll($fields);

        return response()->json(PurchaseRequestResource::collection($purchase_requests));
    }

    public function openRequest()
    {
        $fields = ['id', 'number', 'user_id', 'request_by', 'warehouse_id', 'note', 'created_at'];

        $purchase_requests = $this->purchaseRequestService->getOpenRequest($fields);

        return response()->json(PurchaseRequestResource::collection($purchase_requests));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'number', 'user_id', 'request_by', 'warehouse_id', 'note', 'created_at'];

            $purchase_request = $this->purchaseRequestService->getById($id, $fields);

            return response()->json(new PurchaseRequestResource($purchase_request));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data permintaan pembelian tidak ditemukan'
            ], 404);
        }
    }

    public function store(PurchaseRequestRequest $request)
    {
        $request->validate([
            'products' => 'required|array|min:1',
            'products.*.id' => 'required',
            'products.*.request_qty' => 'required|integer|min:1',
            'products.*.po_qty' => 'required|integer|min:0'
        ], [
            'products' => 'Pilih minimal 1 produk',
            'products.*.id' => 'ID Barang tidak boleh kosong',
            'products.*.request_qty' => 'Jumlah barang minimal 1',
            'products.*.po_qty' => 'Jumlah barang PO tidak boleh kosong'
        ]);
        $purchase_request = $this->purchaseRequestService->create($request->validated());

        $products = $request->products;
        
        foreach ($products as $product) {
            $this->purchaseRequestService->attachProduct($purchase_request->id, $product['id'], $product['request_qty'], $product['po_qty']);
        }

        return response()->json(new PurchaseRequestResource([
            'purchase_request' => $purchase_request
            ]), 201);
    }

    public function update(PurchaseRequestRequest $request, int $id)
    {
        try {
            $purchase_request = $this->purchaseRequestService->update($id, $request->validated());
            
            $this->purchaseRequestService->updateProduct($id, $request->products);

            return response()->json(new PurchaseRequestResource($purchase_request));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data permintaan pembelian tidak ditemukan'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $fields = ['id'];

            $purchase_request = $this->purchaseRequestService->getById($id, $fields);

            $purchase_request->products()->detach();
            $this->purchaseRequestService->delete($id);
            return response()->json([
                'message' => 'Data permintaan pembelian berhasil dihapus'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data permintaan pembelian tidak ditemukan'
            ], 404);
        }
    }
}
