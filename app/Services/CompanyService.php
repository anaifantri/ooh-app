<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use App\Repositories\CompanyRepository;
use Illuminate\Support\Facades\Storage;

class CompanyService
{
    private $companyRepository;

    public function __construct(CompanyRepository $companyRepository){
        $this->companyRepository = $companyRepository;
    }

    public function getAll(array $fields)
    {
        return $this->companyRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->companyRepository->getById($id, $fields ?? ['*']);
    }

    public function create(array $data)
    {
        if (isset($data['logo']) && $data['logo'] instanceof UploadedFile){
            $data['logo'] = $this->uploadPhoto($data['logo']);
        }

        return $this->companyRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'logo'];
        $company = $this->companyRepository->getById($id, $fields);

        if (isset($data['logo']) && $data['logo'] instanceof UploadedFile){
            if(!empty($company->logo)){
                $this->deletePhoto($company->logo);
            }

            $data['logo'] = $this->uploadPhoto($data['logo']);
        }

        return $this->companyRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'logo'];
        $company = $this->companyRepository->getById($id, $fields);

        if ($company->logo){
            $this->deletePhoto($company->logo);
        }

        return $this->companyRepository->delete($id);
    }

    private function uploadPhoto(UploadedFile $photo)
    {
        return $photo->store('company-logo', 'public');
    }

    private function deletePhoto(string $photoPath)
    {
        $relativePath = 'company-logo/'. basename($photoPath);
        if(Storage::disk('public')->exists($relativePath)){
            Storage::disk('public')->delete($relativePath);
        }
    }
}