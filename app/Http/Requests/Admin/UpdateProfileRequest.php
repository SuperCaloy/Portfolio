<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Auth middleware already restricts this route, controller stays clean
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'professional_title' => ['nullable', 'string', 'max:255'],
            'bio' => ['required', 'string', 'max:500'],
            'about_me' => ['required', 'string'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'avatar' => ['nullable', 'file', 'image', 'max:4096'],
            'resume' => ['nullable', 'file', 'mimes:pdf', 'max:8192'],
        ];
    }

    public function messages(): array
    {
        return [
            'bio.max' => 'Bio must be 500 characters or less.',
            'resume.mimes' => 'Resume must be a PDF file.',
            'avatar.image' => 'Avatar must be an image file.',
        ];
    }
}