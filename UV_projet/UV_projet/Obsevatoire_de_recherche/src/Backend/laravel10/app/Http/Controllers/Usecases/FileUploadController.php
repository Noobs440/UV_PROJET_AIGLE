<?php

namespace App\Http\Controllers\Usecases;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FileUploadController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/usecases/upload",
     *     summary="Télécharger un fichier",
     *     tags={"Fichiers"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="file", type="string", format="binary", description="Fichier à télécharger"),
     *                 @OA\Property(property="path", type="string", description="Chemin où le fichier sera stocké (ex: doc/projet)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="URL publique du fichier téléchargé",
     *         @OA\JsonContent(
     *             @OA\Property(property="url", type="string", example="http://example.com/doc/projet/fichier.pdf")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation échouée"
     *     )
     * )
     */
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'path' => 'required|string', // ex: doc/projet
        ]);

        $file = $request->file('file');
        $relativePath = trim($request->input('path'), '/'); // ex: doc/projet
        $destinationPath = public_path($relativePath);

        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $fileName = $file->getClientOriginalName(); // tu peux aussi générer un nom unique ici si besoin
        $file->move($destinationPath, $fileName);

        $publicUrl = url($relativePath . '/' . $fileName);

        return response()->json(['url' => $publicUrl], 200, [], JSON_UNESCAPED_SLASHES);
    }

    /**
     * @OA\Delete(
     *     path="/api/usecases/upload/delete",
     *     summary="Supprimer un fichier",
     *     tags={"Fichiers"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="path", type="string", description="Chemin relatif du fichier à supprimer (ex: doc/projet/fichier.pdf)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Fichier supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="File deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Fichier non trouvé"
     *     )
     * )
     */
    public function deleteFile(Request $request)
    {
        $request->validate([
            'path' => 'required|string', // ex: doc/projet/fichier.pdf
        ]);

        $filePath = public_path(trim($request->input('path'), '/'));

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['message' => 'File deleted successfully.']);
        } else {
            return response()->json(['message' => 'File not found.'], 404);
        }
    }
}
