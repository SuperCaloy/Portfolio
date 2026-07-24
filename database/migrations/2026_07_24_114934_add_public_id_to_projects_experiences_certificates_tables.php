<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['projects', 'experiences', 'certificates'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->string('public_id', 26)->nullable()->after('id');
            });
        }

        foreach (['projects', 'experiences', 'certificates'] as $tableName) {
            DB::table($tableName)->whereNull('public_id')->orderBy('id')->chunkById(100, function ($rows) use ($tableName) {
                foreach ($rows as $row) {
                    DB::table($tableName)->where('id', $row->id)->update([
                        'public_id' => Str::random(20),
                    ]);
                }
            });
        }

        foreach (['projects', 'experiences', 'certificates'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->unique('public_id');
            });
        }
    }
    public function down(): void
    {
        foreach (['projects', 'experiences', 'certificates'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->dropUnique([$tableName . '_public_id_unique']);
                $table->dropColumn('public_id');
            });
        }
    }

};