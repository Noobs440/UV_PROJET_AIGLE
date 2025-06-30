<?php

namespace App\Http\Controllers\Ressources;

use App\Http\Controllers\Controller;
use App\Models\TblDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Services\FileUploadService;
use App\Models\TblProjet;

class TblDocumentController extends Controller
{
    private $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $document = TblDocument::all();
        return response()->json($document);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_doc' => 'required|unique:tbl_documents,nom_doc|max:255',
            'tbl_projet_id' => 'required|exists:tbl_projets,id',
            'document' => 'required|file|mimes:pdf,doc,docx',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $project = TblProjet::find($request->tbl_projet_id);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // 🔁 Tous les fichiers sont stockés dans le même dossier :
        $documentUrl = $this->fileUploadService->uploadFile($request->file('document'), 'public/doc/projet');

        $document = TblDocument::create([
            'nom_doc' => $request->nom_doc,
            'lien_doc' => $documentUrl, // Exemple : doc/projet/filename.pdf
            'tbl_projet_id' => $request->tbl_projet_id,
            'user_id' => $request->user_id,
        ]);

        return response()->json($document, 201);
    }

    public function show(string $id)
    {
        $document = TblDocument::where('id', $id)->firstOrFail();
        return response()->json($document);
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'nom_doc' => 'required|unique:tbl_documents,nom_doc,' . $id,
            'type_doc' => ['required', 'in:PDF,WORD,POWERPOINT'],
            'resume' => 'required',
            'tbl_projet_id' => 'required|exists:tbl_projets,id',
            'document' => 'nullable|file|mimes:pdf,doc,docx',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $project = TblProjet::find($request->tbl_projet_id);
        $document = TblDocument::where('id', $id)->firstOrFail();

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        if ($request->hasFile('document')) {
            // 🆕 On remplace le fichier par un nouveau (dans le même répertoire)
            $documentUrl = $this->fileUploadService->uploadFile($request->file('document'), 'public/doc/projet');
            $document->lien_doc = $documentUrl;
        }

        $document->nom_doc = $request->nom_doc;
        $document->type_doc = $request->type_doc;
        $document->resume = $request->resume;
        $document->tbl_projet_id = $request->tbl_projet_id;
        $document->tbl_user_id = $request->user_id;
        $document->save();

        return response()->json($document);
    }

    public function destroy(string $id)
    {
        $document = TblDocument::findOrFail($id);

        // 🗑️ Supprime le fichier s’il existe dans storage/app/public/...
        if ($document->lien_doc && Storage::disk('public')->exists($document->lien_doc)) {
            Storage::disk('public')->delete($document->lien_doc);
        }

        $document->delete();
        return response()->noContent();
    }
}
