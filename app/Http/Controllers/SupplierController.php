<?php

namespace App\Http\Controllers;

use App\Services\SupplierService;
use App\Http\Requests\SupplierRequest;
use App\Http\Resources\SupplierResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SupplierController extends Controller
{
    private $supplierService;

    public function __construct(SupplierService $supplierService){
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        $fields = ['id', 'supplier_category_id', 'code', 'name', 'address', 'phone', 'mobile', 'email'];

        $suppliers = $this->supplierService->getAll($fields);

        return response()->json(SupplierResource::collection($suppliers));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'supplier_category_id', 'code', 'name', 'address', 'phone', 'email'];

            $supplier = $this->supplierService->getById($id, $fields);

            return response()->json(new SupplierResource($supplier));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Supplier not found'
            ], 404);
        }
    }

    public function store(SupplierRequest $request)
    {
        $supplier = $this->supplierService->create($request->validated());

        return response()->json(new SupplierResource([
            'supplier' => $supplier
            ]), 201);
    }

    public function update(SupplierRequest $request, int $id)
    {
        try {
            $supplier = $this->supplierService->update($id, $request->validated());
            
            return response()->json(new SupplierResource($supplier));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Supplier not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->supplierService->delete($id);
            return response()->json([
                'message' => 'Supplier delete successfuly'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Supplier not found'
            ], 404);
        }
    }
}
