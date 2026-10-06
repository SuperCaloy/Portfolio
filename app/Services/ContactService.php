<?php

namespace App\Services;

use App\Mail\ContactAutoReplyMail;
use App\Mail\ContactFormMail;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactService
{
    // Handles contact message persistence and mail notifications.
    public function handle(array $validated): Message
    {
        $message = Message::create([
            'sender_name' => $validated['name'],
            'sender_email' => $validated['email'],
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'],
        ]);

        $adminRecipient = config('mail.to.address');
        if (! empty($adminRecipient)) {
            Mail::to($adminRecipient)->send(new ContactFormMail($validated));
        }

        try {
            Mail::to($validated['email'])->send(new ContactAutoReplyMail($validated));
        } catch (\Throwable $e) {
            Log::warning('Auto-reply failed to send: ' . $e->getMessage());
        }

        return $message;
    }
}
