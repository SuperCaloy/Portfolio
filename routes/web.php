<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Public\ResumeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\MessageController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Admin\DashboardController;


Route::get('/', [HomeController::class, 'index']);
Route::get('/projects', [HomeController::class, 'index']);
Route::get('/tech', [HomeController::class, 'index']);
Route::get('/experience', [HomeController::class, 'index']);
Route::get('/certificates', [HomeController::class, 'index']);
Route::get('/resume', [ResumeController::class, 'download'])->name('resume.download');

Route::post('/api/contact', [ContactController::class, 'send'])
    ->middleware(['throttle:3,1', 'throttle:10,1440']);

Route::get('/system/keep-alive', function (Illuminate\Http\Request $request) {
    if ($request->query('token') !== config('app.keep_alive_token')) {
        abort(403);
    }

    DB::select('select 1');

    return response('OK', 200);
})->middleware('throttle:10,1');



Route::prefix(config('app.admin_slug'))->group(function () {
    //login
    Route::post('/login', [AdminAuthController::class, 'sendOtp'])->name('admin.login.send');
    Route::post('/verify', [AdminAuthController::class, 'verifyOtp'])->name('admin.login.verify');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
        //dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
        //profile
        Route::get('/dashboard/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
        Route::put('/dashboard/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
        //skills
        Route::get('/dashboard/skills', [SkillController::class, 'index'])->name('admin.skills.index');
        Route::post('/dashboard/skills', [SkillController::class, 'store'])->name('admin.skills.store');
        Route::put('/dashboard/skills/{skill}', [SkillController::class, 'update'])->name('admin.skills.update');
        Route::delete('/dashboard/skills/{skill}', [SkillController::class, 'destroy'])->name('admin.skills.destroy');
        Route::post('/dashboard/skills/reorder', [SkillController::class, 'reorder'])->name('admin.skills.reorder');
        Route::post('/dashboard/skills/quick-add', [SkillController::class, 'quickAdd'])->name('admin.skills.quickadd');
        //projects
        Route::get('/dashboard/projects', [ProjectController::class, 'index'])->name('admin.projects.index');
        Route::post('/dashboard/projects', [ProjectController::class, 'store'])->name('admin.projects.store');
        Route::put('/dashboard/projects/{project}', [ProjectController::class, 'update'])->name('admin.projects.update');
        Route::delete('/dashboard/projects/{project}', [ProjectController::class, 'destroy'])->name('admin.projects.destroy');
        Route::post('/dashboard/projects/reorder', [ProjectController::class, 'reorder'])->name('admin.projects.reorder');
        //experience
        Route::get('/dashboard/experience', [ExperienceController::class, 'index'])->name('admin.experience.index');
        Route::post('/dashboard/experience', [ExperienceController::class, 'store'])->name('admin.experience.store');
        Route::put('/dashboard/experience/{experience}', [ExperienceController::class, 'update'])->name('admin.experience.update');
        Route::delete('/dashboard/experience/{experience}', [ExperienceController::class, 'destroy'])->name('admin.experience.destroy');

        //certificate
        Route::get('/dashboard/certificates', [CertificateController::class, 'index'])->name('admin.certificates.index');
        Route::post('/dashboard/certificates', [CertificateController::class, 'store'])->name('admin.certificates.store');
        Route::put('/dashboard/certificates/{certificate}', [CertificateController::class, 'update'])->name('admin.certificates.update');
        Route::delete('/dashboard/certificates/{certificate}', [CertificateController::class, 'destroy'])->name('admin.certificates.destroy');
        //messages
        Route::get('/dashboard/messages', [MessageController::class, 'index'])->name('admin.messages.index');
        Route::put('/dashboard/messages/{message}/read', [MessageController::class, 'markAsRead'])->name('admin.messages.read');
        Route::put('/dashboard/messages/{message}/notes', [MessageController::class, 'updateNotes'])->name('admin.messages.notes');
        Route::delete('/dashboard/messages/{message}', [MessageController::class, 'destroy'])->name('admin.messages.destroy');


        Route::get('/dashboard/login-activity', [\App\Http\Controllers\Admin\LoginActivityController::class, 'index'])->name('admin.login-activity.index');
        });
});

