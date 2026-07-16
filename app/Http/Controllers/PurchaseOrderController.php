<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseOrderRequest;
use App\Http\Resources\PurchaseOrderResource;
use App\Models\PurchaseRequest;
use App\Services\OrderProductService;
use App\Services\PurchaseOrderService;
use App\Services\PurchaseRequestService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PurchaseOrderController extends Controller
{
    private $purchaseOrderService;
    private $orderProductService;
    private $purchaseRequestService;

    public function __construct(PurchaseOrderService $purchaseOrderService, OrderProductService $orderProductService,PurchaseRequestService $purchaseRequestService){
        $this->purchaseOrderService = $purchaseOrderService;
        $this->orderProductService = $orderProductService;
        $this->purchaseRequestService = $purchaseRequestService;
    }

    public function index()
    {
        $fields = ['id', 'number', 'user_id', 'supplier_id', 'purchase_request_id', 'created_at', 'sub_total', 'tax', 'grand_total'];

        $purchase_orders = $this->purchaseOrderService->getAll($fields);

        return response()->json(PurchaseOrderResource::collection($purchase_orders));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'number', 'user_id', 'supplier_id', 'purchase_request_id', 'created_at', 'sub_total', 'tax', 'grand_total'];

            $purchase_order = $this->purchaseOrderService->getById($id, $fields);

            return response()->json(new PurchaseOrderResource($purchase_order));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data PO tidak ditemukan'
            ], 404);
        }
    }

    public function store(PurchaseOrderRequest $request)
    {
        $request->validate([
            'products' => 'required|array|min:1',
            'products.*.id' => 'required',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.price' => 'required|integer|min:1'
        ], [
            'products' => 'Pilih minimal 1 produk',
            'products.*.id' => 'ID Barang tidak boleh kosong',
            'products.*.qty' => 'Jumlah barang minimal 1',
            'products.*.price' => 'Harga tidak boleh kosong',
        ]);

        $purchase_order = $this->purchaseOrderService->create($request->validated());

        $products = $request->products;
        
        foreach ($products as $product) {
            $this->purchaseOrderService->attachProduct($purchase_order->id, $product['id'], $product['qty'], $product['price']);
        }
        $this->purchaseRequestService->updatePoQty($purchase_order->purchase_request_id, $products);

        return response()->json(new PurchaseOrderResource([
            'purchase_order' => $purchase_order
            ]), 201);
    }

    public function update(PurchaseOrderRequest $request, int $id)
    {
        try {
            $requestProducts = $request->request_products;
            $newProducts = $request->products;

            $purchaseRequest = PurchaseRequest::findOrFail($request->purchase_request_id);
            $sync_products = [];
            
            for($i = 0; $i < count($requestProducts); $i++){
                $qty = 0;
                for($j = 0; $j < count($newProducts); $j++){
                    if ($newProducts[$j]['id'] == $requestProducts[$i]['id']) {
                        $qty = $newProducts[$j]['qty'];
                    }
                }
                $sync_products[$requestProducts[$i]['id']] = [
                        'po_qty' => $qty
                    ];
            }

            $purchaseRequest->products()->syncWithoutDetaching($sync_products);

            $purchase_order = $this->purchaseOrderService->update($id, $request->validated());
            
            $this->purchaseOrderService->updateProduct($id, $newProducts);

            return response()->json(new PurchaseOrderResource($purchase_order));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data PO tidak ditemukan'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $fields = ['id','purchase_request_id'];

            $purchase_order = $this->purchaseOrderService->getById($id, $fields);

            $products = $purchase_order->products;
            $requestId = $purchase_order->purchase_request_id;
            $purchaseRequest = PurchaseRequest::findOrFail($requestId);
            $sync_products = [];
            for($i = 0; $i < count($products); $i++){
                $sync_products[$products[$i]['id']] = [
                    'po_qty' => 0
                    ];
            }
            $purchaseRequest->products()->syncWithoutDetaching($sync_products);

            $purchase_order->products()->detach();
            $this->purchaseOrderService->delete($id);
            return response()->json([
                'message' => 'Data PO berhasil di hapus'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data PO tidak ditemukan'
            ], 404);
        }
    }
}
