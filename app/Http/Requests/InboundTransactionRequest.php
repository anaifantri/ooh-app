<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InboundTransactionRequest extends FormRequest
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
            'number' => 'required|unique:inbound_transactions,number,' . $this->route('id'),
            'user_id' => 'required',
            'supplier_id' => 'required',
            'warehouse_id' => 'required',
            'date' => 'required',
            'sub_total' => 'required',
            'tax' => 'required',
            'grand_total' => 'required',
            'note' => 'nullable',
            'receipt' => 'required|image|mimes:jpeg,jpg,png|max:1024',
            'products' => 'required|array|min:1',
            'products.*.*' => 'required'
        ];
    }
}
