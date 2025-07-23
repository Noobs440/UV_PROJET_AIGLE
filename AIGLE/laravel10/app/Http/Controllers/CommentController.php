<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Liste des commentaires d'un projet (avec réponses imbriquées)
    public function index($project_id)
    {
        $comments = Comment::with(['user', 'replies.user'])
            ->where('project_id', $project_id)
            ->whereNull('parent_id')
            ->orderByDesc('created_at')
            ->get();
        return response()->json($comments);
    }

    // Ajouter un commentaire
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:tbl_projets,id',
            'content' => 'required|string',
        ]);
        $comment = Comment::create([
            'project_id' => $validated['project_id'],
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);
        return response()->json($comment, 201);
    }

    // Répondre à un commentaire
    public function reply(Request $request, $parent_id)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:tbl_projets,id',
            'content' => 'required|string',
        ]);
        $reply = Comment::create([
            'project_id' => $validated['project_id'],
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'parent_id' => $parent_id,
        ]);
        return response()->json($reply, 201);
    }

    // Modifier un commentaire
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        $this->authorize('update', $comment);
        $request->validate(['content' => 'required|string']);
        $comment->content = $request->content;
        $comment->save();
        return response()->json($comment);
    }

    // Supprimer un commentaire
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->noContent();
    }
}
