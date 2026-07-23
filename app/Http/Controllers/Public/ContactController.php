<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Mail\ContactFormMail;
use App\Mail\ContactAutoReplyMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        // 1. Anti-Bot Honeypot Check
        if ($request->filled('website')) {
            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully.',
            ], 200);
        }

        // 2. Fast & Reliable RFC + DNS Validation
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email:rfc,dns|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ], [
            'email.email' => 'The email address domain does not exist or cannot receive mail.',
        ]);

        // 3. Save Record to Database
        $message = Message::create([
            'sender_name'  => $validated['name'],
            'sender_email' => $validated['email'],
            'subject'      => $validated['subject'] ?? null,
            'message'      => $validated['message'],
        ]);

        // 4. Send Notification Email to Yourself
        $adminRecipient = config('mail.to.address') ?? env('MAIL_TO_ADDRESS');
        Mail::to($adminRecipient)->send(new ContactFormMail($validated));

        // 5. Send Auto-Reply Confirmation Email to Visitor
        try {
            Mail::to($validated['email'])->send(new ContactAutoReplyMail($validated));
        } catch (\Exception $e) {
            // Log if auto-reply fails without crashing the form response
            Log::warning('Auto-reply failed to send: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully.',
        ], 200);
    }
}