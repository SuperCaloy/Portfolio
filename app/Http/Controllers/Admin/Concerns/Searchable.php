<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    /**
     * Apply a unified multi-column search condition to an Eloquent builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $search
     * @param  array<int, string>  $columns
     * @param  callable|null  $callback
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function applySearch(Builder $query, ?string $search, array $columns, ?callable $callback = null): Builder
    {
        if (blank($search)) {
            return $query;
        }

        $trimmed = trim($search);

        return $query->where(function (Builder $builder) use ($trimmed, $columns, $callback) {
            foreach ($columns as $column) {
                $builder->orWhere($column, 'like', "%{$trimmed}%");
            }

            if ($callback !== null) {
                $callback($builder, $trimmed);
            }
        });
    }
}
