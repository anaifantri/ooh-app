<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', function () {
    return inertia('Dashboards/Index');
});

// Users Route
Route::get('/users', function () {
    return inertia('Users/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/users/create', function () {
    return inertia('Users/Create');
});
Route::get('/users/show/{userId}', function () {
    return inertia('Users/Show',['message' => request('message')]);
});
Route::get('/users/edit/{userId}', function () {
    return inertia('Users/Edit');
});

Route::get('/companies', function () {
    return inertia('Companies/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/companies/create', function () {
    return inertia('Companies/Create');
});
Route::get('/companies/show/{userId}', function () {
    return inertia('Companies/Show',['message' => request('message')]);
});
Route::get('/companies/edit/{companyId}', function () {
    return inertia('Companies/Edit');
});

Route::get('/products', function () {
    return inertia('Products/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/products/create', function () {
    return inertia('Products/Create');
});
Route::get('/products/show/{productId}', function () {
    return inertia('Products/Show',['message' => request('message')]);
});
Route::get('/products/edit/{productId}', function () {
    return inertia('Products/Edit');
});

Route::get('/product-categories', function () {
    return inertia('ProductCategories/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/product-categories/create', function () {
    return inertia('ProductCategories/Create');
});
Route::get('/product-categories/show/{categoryId}', function () {
    return inertia('ProductCategories/Show',['message' => request('message')]);
});
Route::get('/product-categories/edit/{categoryId}', function () {
    return inertia('ProductCategories/Edit');
});

Route::get('/warehouses', function () {
    return inertia('Warehouses/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/warehouses/create', function () {
    return inertia('Warehouses/Create');
});
Route::get('/warehouses/show/{categoryId}', function () {
    return inertia('Warehouses/Show',['message' => request('message')]);
});
Route::get('/warehouses/edit/{warehouseId}', function () {
    return inertia('Warehouses/Edit');
});

// Route for CRUD supplier categories
Route::get('/supplier-categories', function () {
    return inertia('SupplierCategories/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/supplier-categories/create', function () {
    return inertia('SupplierCategories/Create');
});
Route::get('/supplier-categories/show/{categoryId}', function () {
    return inertia('SupplierCategories/Show',['message' => request('message')]);
});
Route::get('/supplier-categories/edit/{categoryId}', function () {
    return inertia('SupplierCategories/Edit');
});

Route::get('/suppliers', function () {
    return inertia('Suppliers/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/suppliers/create', function () {
    return inertia('Suppliers/Create');
});
Route::get('/suppliers/show/{categoryId}', function () {
    return inertia('Suppliers/Show',['message' => request('message')]);
});
Route::get('/suppliers/edit/{categoryId}', function () {
    return inertia('Suppliers/Edit');
});

Route::get('/purchase-requests', function () {
    return inertia('PurchaseRequests/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/purchase-requests/create', function () {
    return inertia('PurchaseRequests/Create');
});
Route::get('/purchase-requests/pdf/{requestId}', function () {
    return inertia('PurchaseRequests/Pdf');
});
Route::get('/purchase-requests/show/{requestId}', function () {
    return inertia('PurchaseRequests/Show',['message' => request('message')]);
});
Route::get('/purchase-requests/edit/{requestId}', function () {
    return inertia('PurchaseRequests/Edit');
});

Route::get('/purchase-orders', function () {
    return inertia('PurchaseOrders/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/purchase-orders/create', function () {
    return inertia('PurchaseOrders/Create');
});
Route::get('/purchase-orders/show/{orderId}', function () {
    return inertia('PurchaseOrders/Show',['message' => request('message')]);
});
Route::get('/purchase-orders/pdf/{orderId}', function () {
    return inertia('PurchaseOrders/Pdf');
});
Route::get('/purchase-orders/edit/{orderId}', function () {
    return inertia('PurchaseOrders/Edit');
});

Route::get('/inbounds', function () {
    return inertia('Inbounds/Index',['message' => request('message'), 'failed'=>request('failed')]);
});
Route::get('/inbounds/create', function () {
    return inertia('Inbounds/Create');
});
Route::get('/inbounds/show/{orderId}', function () {
    return inertia('Inbounds/Show',['message' => request('message')]);
});

Route::get('/purchase-invoices', function () {
    return inertia('PurchaseInvoices/Index');
});

Route::get('/projects', function () {
    return inertia('Projects/Index');
});

Route::get('/expenditures', function () {
    return inertia('Expenditures/Index');
});
