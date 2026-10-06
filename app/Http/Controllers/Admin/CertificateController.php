<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\Searchable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CertificateRequest;
use App\Models\Certificate;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateController extends Controller
{
    use Searchable;

    public function __construct(protected MediaService $media)
    {
    }

    // List certificates, most recent issue date first, supports search and pagination
    public function index(Request $request)
    {
        $query = Certificate::query();
        $this->applySearch($query, $request->search, ['title', 'issuer']);

        $certificates = $query->orderBy('issue_date', 'desc')
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
            $uploaded = $this->media->upload($request->file('image'), 'portfolio/certificates');
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
            $this->media->deleteSafely($certificate->image_public_id);
            $data['image_path'] = null;
            $data['image_public_id'] = null;
        } elseif ($request->hasFile('image')) {
            $this->media->deleteSafely($certificate->image_public_id);
            $uploaded = $this->media->upload($request->file('image'), 'portfolio/certificates');
            $data['image_path'] = $uploaded['url'];
            $data['image_public_id'] = $uploaded['public_id'];
        }

        $certificate->update($data);

        return redirect()->back()->with('success', 'Certificate updated.');
    }

    // Delete a certificate and its Cloudinary image
    public function destroy(Certificate $certificate)
    {
        $this->media->deleteSafely($certificate->image_public_id);
        $certificate->delete();

        return redirect()->back()->with('success', 'Certificate deleted.');
    }
}