<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WarehouseRequest extends FormRequest
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
            'name' => 'required|unique:warehouses,name,' . $this->route('id'),
            'code' => 'required|string|max:10|unique:warehouses,code,' . $this->route('id'),
            'address' => 'required',
            'phone' => 'nullable|unique:warehouses,phone,' . $this->route('id'),
            'mobile' => 'nullable|unique:warehouses,mobile,' . $this->route('id'),
            'email' => 'nullable|unique:warehouses,email,' . $this->route('id'),
            'photo' => 'nullable|image|mimes:jpg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Nama gudang sudah terdaftar, silahkan input nama yang lain',
            'address.required' => 'Alamat tidak boleh kosong',
            'phone.unique' => 'Nomor telepon sudah terdaftar, silahkan input nomor yang lain',
            'mobile.unique' => 'Nomor HP sudah terdaftar, silahkan input nomor yang lain',
            'code.unique' => 'Kode gudang sudah terdaftar, silahkan input kode yang lain',
            'code.max' => 'Kode maksimal 10 karakter',
            'email.email' => 'Silahkan input alamat email yang valid',
            'email.unique' => 'Alamat email sudah terdaftar, silahkan input alamat email yang lain',
        ];
    }
}
