<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'supplier_category_id' => 'required',
            'category_code' => 'required',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|unique:suppliers,phone,' . $this->route('id'),
            'mobile' => 'nullable|string|unique:suppliers,mobile,' . $this->route('id'),
            'email' => 'nullable|string|unique:suppliers,email,' . $this->route('id'),
        ];
    }
}
