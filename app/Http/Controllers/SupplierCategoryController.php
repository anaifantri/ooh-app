<?php

namespace App\Http\Controllers;

use App\Services\SupplierCategoryService;
use App\Http\Requests\SupplierCategoryRequest;
use App\Http\Resources\SupplierCategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SupplierCategoryController extends Controller
{
    private $supplierCategoryService;

    public function __construct(SupplierCategoryService $supplierCategoryService){
        $this->supplierCategoryService = $supplierCategoryService;
    }

    public function index()
    {
        $fields = ['id', 'code', 'name', 'description'];

        $supplier_categories = $this->supplierCategoryService->getAll($fields);

        return response()->json(SupplierCategoryResource::collection($supplier_categories));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'code', 'name', 'description'];

            $supplier_category = $this->supplierCategoryService->getById($id, $fields);

            return response()->json(new SupplierCategoryResource($supplier_category));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Supplier category not found'
            ], 404);
        }
    }

    public function store(SupplierCategoryRequest $request)
    {
        $supplier_category = $this->supplierCategoryService->create($request->validated());

        return response()->json(new SupplierCategoryResource([
            'product_category' => $supplier_category
            ]), 201);
    }

    public function update(SupplierCategoryRequest $request, int $id)
    {
        try {
            $supplier_category = $this->supplierCategoryService->update($id, $request->validated());
            
            return response()->json(new SupplierCategoryResource($supplier_category));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Supplier category not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->supplierCategoryService->delete($id);
            return response()->json([
                'message' => 'Supplier category delete successfuly'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Supplier category not found'
            ], 404);
        }
    }
}
