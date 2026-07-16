<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InboundRequest extends FormRequest
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
            'user_id' => 'required',
            'warehouse_id' => 'required',
            'purchase_order_id' => 'required',
            'date' => 'required',
            'products' => 'required|array|min:1',
            'products.*.*' => 'required'
        ];
    }
}
