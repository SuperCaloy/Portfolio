<?php

namespace App\Http\Requests\Admin;

use App\Enums\SkillCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', Rule::enum(SkillCategory::class)],
            'icon_name' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}