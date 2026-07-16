<?php

namespace App\Http\Controllers;

use App\Services\ProductCategoryService;
use App\Http\Requests\ProductCategoryRequest;
use App\Http\Resources\ProductCategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductCategoryController extends Controller
{
    private $productCategoryService;

    public function __construct(ProductCategoryService $productCategoryService){
        $this->productCategoryService = $productCategoryService;
    }

    public function index()
    {
        $fields = ['id', 'name', 'code', 'description'];

        $product_categories = $this->productCategoryService->getAll($fields);

        return response()->json(ProductCategoryResource::collection($product_categories));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'name', 'code', 'description'];

            $product_category = $this->productCategoryService->getById($id, $fields);

            return response()->json(new ProductCategoryResource($product_category));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product category not found'
            ], 404);
        }
    }

    public function store(ProductCategoryRequest $request)
    {
        $product_category = $this->productCategoryService->create($request->validated());

        return response()->json(new ProductCategoryResource([
            'product_category' => $product_category
            ]), 201);
    }

    public function update(ProductCategoryRequest $request, int $id)
    {
        try {
            $product_category = $this->productCategoryService->update($id, $request->validated());
            
            return response()->json(new ProductCategoryResource($product_category));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product category not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->productCategoryService->delete($id);
            return response()->json([
                'message' => 'Product category delete successfuly'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product category not found'
            ], 404);
        }
    }
}
