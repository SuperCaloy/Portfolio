<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MessageNotesRequest;
use App\Http\Requests\Admin\BulkMessageActionRequest;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    // List messages, newest first, supports search and pagination
    public function index(Request $request)
    {
        $messages = Message::when($request->search, function ($query, $search) {
                $query->where('sender_name', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
            'filters' => $request->only('search'),
        ]);
    }

    // Toggle read status for a message
    public function markAsRead(Message $message)
    {
        $message->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Message marked as read.');
    }

    // Update internal admin notes for a message, only editable field besides read status
    public function updateNotes(MessageNotesRequest $request, Message $message)
    {
        $message->update(['admin_notes' => $request->validated()['admin_notes']]);

        return redirect()->back()->with('success', 'Notes updated.');
    }

    // Delete a message
    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->back()->with('success', 'Message deleted.');
    }
    // Mark multiple messages as read in one request
    public function bulkMarkAsRead(BulkMessageActionRequest $request)
    {
        Message::whereIn('id', $request->validated()['ids'])->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Messages marked as read.');
    }

    // Delete multiple messages in one request
    public function bulkDelete(BulkMessageActionRequest $request)
    {
        Message::whereIn('id', $request->validated()['ids'])->delete();

        return redirect()->back()->with('success', 'Messages deleted.');
    }
}