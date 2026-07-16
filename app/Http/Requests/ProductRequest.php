<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'product_category_id' => 'required',
            'category_code' => 'required',
            'name' => 'required|string|max:255|unique:products,name,' . $this->route('id'),
            'photo' => 'image|mimes:jpeg,jpg,png|max:1024|nullable',
            'price' => 'nullable|integer',
            'unit' => 'required',
            'description' => 'nullable|string',
        ];
    }
}
