<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['projects', 'experiences', 'certificates'] as $tableName) {
            DB::table($tableName)->whereNull('public_id')->orderBy('id')->chunkById(100, function ($rows) use ($tableName) {
                foreach ($rows as $row) {
                    do {
                        $candidate = Str::random(20);
                    } while (DB::table($tableName)->where('public_id', $candidate)->exists());

                    DB::table($tableName)->where('id', $row->id)->update([
                        'public_id' => $candidate,
                    ]);
                }
            });

            Schema::table($tableName, function (Blueprint $table) {
                $table->string('public_id', 26)->nullable(false)->change();
            });
        }
    }

    public function down(): void
    {
        foreach (['projects', 'experiences', 'certificates'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->string('public_id', 26)->nullable()->change();
            });
        }
    }
};
