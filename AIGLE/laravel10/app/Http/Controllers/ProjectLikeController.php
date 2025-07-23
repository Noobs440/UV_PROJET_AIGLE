<?php

namespace App\Http\Controllers;

use App\Models\ProjectLike;
use Illuminate\Http\Request;

class ProjectLikeController extends Controller
{
    public function toggleLike($projectId)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['error' => 'Non authentifié'], 401);

        $like = ProjectLike::where('project_id', $projectId)->where('user_id', $user->id)->first();
        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            ProjectLike::create(['project_id' => $projectId, 'user_id' => $user->id]);
            $liked = true;
        }
        $count = ProjectLike::where('project_id', $projectId)->count();
        return response()->json(['liked' => $liked, 'likes' => $count]);
    }

    public function getLikes($projectId)
    {
        $user = auth()->user();
        $liked = false;
        if ($user) {
            $liked = ProjectLike::where('project_id', $projectId)->where('user_id', $user->id)->exists();
        }
        $count = ProjectLike::where('project_id', $projectId)->count();
        return response()->json(['liked' => $liked, 'likes' => $count]);
    }
}
