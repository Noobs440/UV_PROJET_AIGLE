<?php

namespace App\Http\Controllers\Usecases;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($projectId) {
        return Comment::where('project_id', $projectId)->whereNull('parent_id')->with('replies.user', 'user')->get();
    }

    public function store(Request $request, $projectId) {
        $request->validate(['content' => 'required']);
        $comment = Comment::create([
            'project_id' => $projectId,
            'user_id' => auth()->id(),
            'content' => $request->content
        ]);
        return response()->json($comment->load('user'), 201);
    }

    public function reply(Request $request, $commentId) {
        $request->validate(['content' => 'required']);
        $parent = Comment::findOrFail($commentId);
        $reply = Comment::create([
            'project_id' => $parent->project_id,
            'user_id' => auth()->id(),
            'content' => $request->content,
            'parent_id' => $commentId
        ]);
        return response()->json($reply->load('user'), 201);
    }

    public function update(Request $request, $commentId) {
        $comment = Comment::findOrFail($commentId);
        $this->authorize('update', $comment);
        $comment->update(['content' => $request->content]);
        return response()->json($comment);
    }

    public function destroy($commentId) {
        $comment = Comment::findOrFail($commentId);
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
