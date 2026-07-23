<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\AdminAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);
Route::get('/projects', [HomeController::class, 'index']);
Route::get('/skills', [HomeController::class, 'index']);
Route::get('/experience', [HomeController::class, 'index']);
Route::get('/certificates', [HomeController::class, 'index']);

Route::post('/api/contact', [ContactController::class, 'send'])->middleware('throttle:3,1');

Route::prefix(config('app.admin_slug'))->group(function () {
    Route::post('/login', [AdminAuthController::class, 'sendOtp'])->name('admin.login.send');
    Route::post('/verify', [AdminAuthController::class, 'verifyOtp'])->name('admin.login.verify');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
        Route::get('/dashboard', fn () => inertia('Admin/Dashboard'))->name('admin.dashboard');
    });
});