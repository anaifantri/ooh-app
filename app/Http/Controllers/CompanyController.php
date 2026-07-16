<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Services\CompanyService;
use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CompanyController extends Controller
{
    private $companyService;

    public function __construct(CompanyService $companyService){
        $this->companyService = $companyService;
    }

    public function index()
    {
        $fields = ['id', 'initial', 'name', 'address', 'email', 'phone', 'mobile', 'logo', 'website'];

        $companies = $this->companyService->getAll($fields);

        return response()->json(CompanyResource::collection($companies));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'initial', 'name', 'address', 'email', 'phone', 'mobile', 'logo', 'website'];

            $company = $this->companyService->getById($id, $fields);

            return response()->json(new CompanyResource($company));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Company not found'
            ], 404);
        }
    }

    public function store(CompanyRequest $request)
    {
        $company = $this->companyService->create($request->validated());

        return response()->json(new CompanyResource([
            'company' => $company
            ]), 201);
    }

    public function update(CompanyRequest $request, int $id)
    {
        try {
            $company = $this->companyService->update($id, $request->validated());
            
            return response()->json(new CompanyResource($company));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Company not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->companyService->delete($id);
            return response()->json([
                'message' => 'Company delete successfuly'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Company not found'
            ], 404);
        }
    }
}
