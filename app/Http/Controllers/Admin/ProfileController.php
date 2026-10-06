<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Models\PersonalInformation;
use App\Services\MediaService;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(protected MediaService $media)
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
        $data = $request->safe()->except(['avatar', 'resume', 'remove_avatar']);

        if ($request->hasFile('avatar')) {
            $this->media->deleteSafely($profile->avatar_public_id);
            $uploaded = $this->media->upload($request->file('avatar'), 'portfolio/avatar');
            $data['avatar_path'] = $uploaded['url'];
            $data['avatar_public_id'] = $uploaded['public_id'];
        } elseif ($request->boolean('remove_avatar') && $profile->avatar_public_id) {
            $this->media->deleteSafely($profile->avatar_public_id);
            $data['avatar_path'] = null;
            $data['avatar_public_id'] = null;
        }

        if ($request->hasFile('resume')) {
            $this->media->deleteSafely($profile->resume_public_id);
            $uploaded = $this->media->upload($request->file('resume'), 'portfolio/resume');
            $data['resume_path'] = $uploaded['url'];
            $data['resume_public_id'] = $uploaded['public_id'];
        }

        $profile->fill($data);
        $profile->save();

        return redirect()->back()->with('success', 'Profile updated.');
    }
}