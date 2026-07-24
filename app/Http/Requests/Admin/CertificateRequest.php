<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'issuer' => ['required', 'string', 'max:255'],
            'issue_date' => ['required', 'date'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'credential_id' => ['nullable', 'string', 'max:255'],
            'credential_url' => ['nullable', 'url', 'max:255'],
            'image' => ['nullable', 'file', 'image', 'max:4096'],
            'status' => ['required', Rule::in(['Completed', 'In Progress', 'Expired'])],
        ];
    }
}