<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class KeepAliveController extends Controller
{
    public function __invoke(Request $request): Response
    {
        if ($request->query('token') !== config('app.keep_alive_token')) {
            abort(403);
        }

        DB::select('select 1');

        return response('OK', 200);
    }
}
