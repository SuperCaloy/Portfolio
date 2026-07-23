<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Public\ResumeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\ProjectController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/projects', [HomeController::class, 'index']);
Route::get('/skills', [HomeController::class, 'index']);
Route::get('/experience', [HomeController::class, 'index']);
Route::get('/certificates', [HomeController::class, 'index']);
Route::post('/api/contact', [ContactController::class, 'send'])->middleware('throttle:3,1');
Route::get('/resume', [ResumeController::class, 'download'])->name('resume.download');




Route::prefix(config('app.admin_slug'))->group(function () {
    Route::post('/login', [AdminAuthController::class, 'sendOtp'])->name('admin.login.send');
    Route::post('/verify', [AdminAuthController::class, 'verifyOtp'])->name('admin.login.verify');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
        Route::get('/dashboard', fn () => inertia('Admin/Dashboard'))->name('admin.dashboard');

        Route::get('/dashboard/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
        Route::put('/dashboard/profile', [ProfileController::class, 'update'])->name('admin.profile.update');

        Route::get('/dashboard/skills', [SkillController::class, 'index'])->name('admin.skills.index');
        Route::post('/dashboard/skills', [SkillController::class, 'store'])->name('admin.skills.store');
        Route::put('/dashboard/skills/{skill}', [SkillController::class, 'update'])->name('admin.skills.update');
        Route::delete('/dashboard/skills/{skill}', [SkillController::class, 'destroy'])->name('admin.skills.destroy');
        Route::post('/dashboard/skills/reorder', [SkillController::class, 'reorder'])->name('admin.skills.reorder');
        Route::post('/dashboard/skills/quick-add', [SkillController::class, 'quickAdd'])->name('admin.skills.quickadd');

        Route::get('/dashboard/projects', [ProjectController::class, 'index'])->name('admin.projects.index');
        Route::post('/dashboard/projects', [ProjectController::class, 'store'])->name('admin.projects.store');
        Route::put('/dashboard/projects/{project}', [ProjectController::class, 'update'])->name('admin.projects.update');
        Route::delete('/dashboard/projects/{project}', [ProjectController::class, 'destroy'])->name('admin.projects.destroy');
        Route::post('/dashboard/projects/reorder', [ProjectController::class, 'reorder'])->name('admin.projects.reorder');

        
        });
});

