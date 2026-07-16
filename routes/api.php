<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\InboundController;
use App\Http\Controllers\InboundTransactionController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\SupplierCategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseProductController;
use Illuminate\Support\Facades\Route;

//Auth Routes
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');

//User Routes
Route::get('/users', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::get('/users/{id}', [UserController::class, 'show'])->middleware('auth:sanctum');
Route::post('/users/register', [UserController::class, 'store'])->middleware('auth:sanctum');
Route::post('/users/destroy/{id}', [UserController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/users/{id}/update', [UserController::class, 'update'])->middleware('auth:sanctum');

//Company Routes
Route::get('/companies', [CompanyController::class, 'index'])->middleware('auth:sanctum');
Route::get('/companies/{id}', [CompanyController::class, 'show'])->middleware('auth:sanctum');
Route::post('/companies/create', [CompanyController::class, 'store'])->middleware('auth:sanctum');
Route::post('/companies/destroy/{id}', [CompanyController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/companies/{id}/update', [CompanyController::class, 'update'])->middleware('auth:sanctum');

//Product Category Routes
Route::get('/product-categories', [ProductCategoryController::class, 'index'])->middleware('auth:sanctum');
Route::get('/product-categories/{id}', [ProductCategoryController::class, 'show'])->middleware('auth:sanctum');
Route::post('/product-categories/create', [ProductCategoryController::class, 'store'])->middleware('auth:sanctum');
Route::post('/product-categories/destroy/{id}', [ProductCategoryController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/product-categories/{id}/update', [ProductCategoryController::class, 'update'])->middleware('auth:sanctum');

//Product Routes
Route::get('/products', [ProductController::class, 'index'])->middleware('auth:sanctum');
Route::get('/products/{id}', [ProductController::class, 'show'])->middleware('auth:sanctum');
Route::post('/products/create', [ProductController::class, 'store'])->middleware('auth:sanctum');
Route::post('/products/destroy/{id}', [ProductController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/products/{id}/update', [ProductController::class, 'update'])->middleware('auth:sanctum');

//Supplier Categories Routes
Route::get('/supplier-categories', [SupplierCategoryController::class, 'index'])->middleware('auth:sanctum');
Route::get('/supplier-categories/{id}', [SupplierCategoryController::class, 'show'])->middleware('auth:sanctum');
Route::post('/supplier-categories/create', [SupplierCategoryController::class, 'store'])->middleware('auth:sanctum');
Route::post('/supplier-categories/destroy/{id}', [SupplierCategoryController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/supplier-categories/{id}/update', [SupplierCategoryController::class, 'update'])->middleware('auth:sanctum');

//Supplier Routes
Route::get('/suppliers', [SupplierController::class, 'index'])->middleware('auth:sanctum');
Route::get('/suppliers/{id}', [SupplierController::class, 'show'])->middleware('auth:sanctum');
Route::post('/suppliers/create', [SupplierController::class, 'store'])->middleware('auth:sanctum');
Route::post('/suppliers/destroy/{id}', [SupplierController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/suppliers/{id}/update', [SupplierController::class, 'update'])->middleware('auth:sanctum');

//Warehouse Routes
Route::get('/warehouses', [WarehouseController::class, 'index'])->middleware('auth:sanctum');
Route::get('/warehouses/{id}', [WarehouseController::class, 'show'])->middleware('auth:sanctum');
Route::post('/warehouses/create', [WarehouseController::class, 'store'])->middleware('auth:sanctum');
Route::post('/warehouses/destroy/{id}', [WarehouseController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/warehouses/{id}/update', [WarehouseController::class, 'update'])->middleware('auth:sanctum');

//Warehouse Product Routes
Route::post('/warehouse-products/attach/{warehouseID}', [WarehouseProductController::class, 'attach'])->middleware('auth:sanctum');
Route::post('/warehouse-products/detach/{warehouseID}/{productId}', [WarehouseProductController::class, 'detach'])->middleware('auth:sanctum');
Route::post('/warehouse-products/update/{warehouseID}/{productId}', [WarehouseProductController::class, 'update'])->middleware('auth:sanctum');

//Inbound Transaction Routes
Route::get('/inbound-transactions', [InboundTransactionController::class, 'index'])->middleware('auth:sanctum');
Route::get('/inbound-transactions/{id}', [InboundTransactionController::class, 'show'])->middleware('auth:sanctum');
Route::post('/inbound-transactions', [InboundTransactionController::class, 'store'])->middleware('auth:sanctum');
Route::post('/inbound-transactions/destroy/{id}', [InboundTransactionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/inbound-transactions/{id}/update', [InboundTransactionController::class, 'update'])->middleware('auth:sanctum');

//Purchase Request Routes
Route::get('/purchase-requests', [PurchaseRequestController::class, 'index'])->middleware('auth:sanctum');
Route::get('/open-requests', [PurchaseRequestController::class, 'openRequest'])->middleware('auth:sanctum');
Route::get('/purchase-requests/{id}', [PurchaseRequestController::class, 'show'])->middleware('auth:sanctum');
Route::post('/purchase-requests/create', [PurchaseRequestController::class, 'store'])->middleware('auth:sanctum');
Route::post('/purchase-requests/destroy/{id}', [PurchaseRequestController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/purchase-requests/{id}/update', [PurchaseRequestController::class, 'update'])->middleware('auth:sanctum');

//Purchase Order Routes
Route::get('/purchase-orders', [PurchaseOrderController::class, 'index'])->middleware('auth:sanctum');
Route::get('/purchase-orders/{id}', [PurchaseOrderController::class, 'show'])->middleware('auth:sanctum');
Route::post('/purchase-orders', [PurchaseOrderController::class, 'store'])->middleware('auth:sanctum');
Route::post('/purchase-orders/destroy/{id}', [PurchaseOrderController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/purchase-orders/{id}/update', [PurchaseOrderController::class, 'update'])->middleware('auth:sanctum');

//Purchase Order Routes
Route::get('/inbounds', [InboundController::class, 'index'])->middleware('auth:sanctum');
Route::get('/inbounds/{id}', [InboundController::class, 'show'])->middleware('auth:sanctum');
Route::post('/inbounds', [InboundController::class, 'store'])->middleware('auth:sanctum');
Route::post('/inbounds/destroy/{id}', [InboundController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/inbounds/{id}/update', [InboundController::class, 'update'])->middleware('auth:sanctum');


