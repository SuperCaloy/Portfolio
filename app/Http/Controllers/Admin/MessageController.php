<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    // List all messages, newest first
    public function index()
    {
        return Inertia::render('Admin/Messages', [
            'messages' => Message::orderBy('created_at', 'desc')->get(),
        ]);
    }

    // Toggle read status for a message
    public function markAsRead(Message $message)
    {
        $message->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Message marked as read.');
    }

    // Update internal admin notes for a message, only editable field besides read status
    public function updateNotes(Request $request, Message $message)
    {
        $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $message->update(['admin_notes' => $request->admin_notes]);

        return redirect()->back()->with('success', 'Notes updated.');
    }

    // Delete a message
    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->back()->with('success', 'Message deleted.');
    }
}