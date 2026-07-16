<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyRequest extends FormRequest
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
            'initial' => 'required|string|min:3|max:3|unique:companies,initial,' . $this->route('id'),
            'name' => 'required|string|max:255|unique:companies,name,' . $this->route('id'),
            'address' => 'required|string|max:255',
            'email' => 'nullable|email:dns|unique:companies,email,' . $this->route('id'),
            'website' => 'nullable|string|max:255|unique:companies,website,' . $this->route('id'),
            'phone' => 'nullable|unique:companies,phone,' . $this->route('id'),
            'mobile' => 'nullable|unique:companies,mobile,' . $this->route('id'),
            'logo' => 'image|mimes:jpeg,jpg,png|max:1024|nullable'
        ];
    }
}
