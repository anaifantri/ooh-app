<?php

namespace App\Repositories;

use App\Models\company;

class CompanyRepository
{
    public function getAll(array $fields){
        return Company::select($fields)->latest()->paginate(10);
    }

    public function getById(int $id, array $fields){
        return Company::select($fields)->findOrFail($id);
    }

    public function create(array $data){
        return Company::create($data);
    }

    public function update(int $id, array $data){
        $company = Company::findOrFail($id);

        $company->update($data);

        return $company;
    }

    public function delete(int $id){
        $company = Company::findOrFail($id);

        $company->delete();
    }
}