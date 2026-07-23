<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Models\PersonalInformation;
use App\Services\CloudinaryService;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary)
    {
    }

    // Show the profile edit page, creates an empty row if none exists yet
    public function edit()
    {
        $profile = PersonalInformation::first() ?? new PersonalInformation();

        return Inertia::render('Admin/Profile', [
            'profile' => $profile,
        ]);
    }

    // Update the single profile row, uploading avatar or resume only if provided
    public function update(UpdateProfileRequest $request)
    {
        $profile = PersonalInformation::firstOrNew();
        $data = $request->safe()->except(['avatar', 'resume']);

        if ($request->hasFile('avatar')) {
            if ($profile->avatar_public_id) {
                $this->cloudinary->delete($profile->avatar_public_id);
            }
            $uploaded = $this->cloudinary->upload($request->file('avatar'), 'portfolio/avatar');
            $data['avatar_path'] = $uploaded['url'];
            $data['avatar_public_id'] = $uploaded['public_id'];
        }

        if ($request->hasFile('resume')) {
            if ($profile->resume_public_id) {
                $this->cloudinary->delete($profile->resume_public_id);
            }
            $uploaded = $this->cloudinary->upload($request->file('resume'), 'portfolio/resume');
            $data['resume_path'] = $uploaded['url'];
            $data['resume_public_id'] = $uploaded['public_id'];
        }

        $profile->fill($data);
        $profile->save();

        return redirect()->back()->with('success', 'Profile updated.');
    }
}