<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CertificateRequest;
use App\Models\Certificate;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary)
    {
    }

    // List certificates, most recent issue date first, supports search and pagination
    public function index(Request $request)
    {
        $certificates = Certificate::when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('issuer', 'like', "%{$search}%");
            })
            ->orderBy('issue_date', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Certificates', [
            'certificates' => $certificates,
            'filters' => $request->only('search'),
        ]);
    }

    // Create a new certificate, uploads image if provided
    public function store(CertificateRequest $request)
    {
        $data = $request->safe()->except(['image']);

        if ($request->hasFile('image')) {
            $uploaded = $this->cloudinary->upload($request->file('image'), 'portfolio/certificates');
            $data['image_path'] = $uploaded['url'];
            $data['image_public_id'] = $uploaded['public_id'];
        }

        Certificate::create($data);

        return redirect()->back()->with('success', 'Certificate added.');
    }

    // Update an existing certificate, replaces image only if a new one is provided
    public function update(CertificateRequest $request, Certificate $certificate)
    {
        $data = $request->safe()->except(['image', 'remove_image']);

        if ($request->boolean('remove_image')) {
            if ($certificate->image_public_id) {
                try {
                    $this->cloudinary->delete($certificate->image_public_id);
                } catch (\Throwable $e) {
                    // Cloud asset may already be gone, do not block the database update
                }
            }
            $data['image_path'] = null;
            $data['image_public_id'] = null;
        } elseif ($request->hasFile('image')) {
            if ($certificate->image_public_id) {
                try {
                    $this->cloudinary->delete($certificate->image_public_id);
                } catch (\Throwable $e) {
                    // Old asset delete failed, proceed with new upload regardless
                }
            }
            $uploaded = $this->cloudinary->upload($request->file('image'), 'portfolio/certificates');
            $data['image_path'] = $uploaded['url'];
            $data['image_public_id'] = $uploaded['public_id'];
        }

        $certificate->update($data);

        return redirect()->back()->with('success', 'Certificate updated.');
    }

    // Delete a certificate and its Cloudinary image
    public function destroy(Certificate $certificate)
    {
        if ($certificate->image_public_id) {
            $this->cloudinary->delete($certificate->image_public_id);
        }
        $certificate->delete();

        return redirect()->back()->with('success', 'Certificate deleted.');
    }
}