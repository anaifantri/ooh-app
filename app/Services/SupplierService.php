<?php

namespace App\Services;

use App\Repositories\SupplierRepository;

class SupplierService
{
    private $supplierRepository;

    public function __construct(SupplierRepository $supplierRepository)
    {
        $this->supplierRepository = $supplierRepository;
    }

    public function getAll(array $fields)
    {
        return $this->supplierRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->supplierRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        $lastSupplier = $this->supplierRepository->getLastSupplierByCategory($fields ?? ['*'], $data['supplier_category_id']);
        $categoryCode = $data['category_code'];
        if(!$lastSupplier){
            $number = 1;
        }else{
            $number = (int) substr($lastSupplier->code, 4) + 1;
        }
        $newSupplierCode = $categoryCode.'-' . str_pad($number, 3, '0', STR_PAD_LEFT);

        $data['code'] = $newSupplierCode;
        return $this->supplierRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'code', 'name', 'address', 'phone', 'email'];
        $supplier = $this->supplierRepository->getById($id, $fields);
        if($data['supplier_category_id'] != $supplier->supplier_category_id)
        {
            $lastSupplier = $this->supplierRepository->getLastSupplierByCategory($fields, $data['supplier_category_id']);
            $categoryCode = $data['category_code'];
            if(!$lastSupplier){
                $number = 1;
            }else{
                $number = (int) substr($lastSupplier->code, 4) + 1;
            }
            $newSupplierCode = $categoryCode.'-' . str_pad($number, 3, '0', STR_PAD_LEFT);

            $data['code'] = $newSupplierCode;
        }

        return $this->supplierRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'code', 'name', 'address', 'phone', 'email'];
        $supplier = $this->supplierRepository->getById($id, $fields);

        return $this->supplierRepository->delete($id);
    }
}