<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class FileUploadService
{
    public function uploadFile(UploadedFile $file, string $path): string
    {
        // Nettoyer et corriger le chemin
        $relativePath = trim($path, '/'); // Ex: doc/projet
        $destinationPath = public_path($relativePath);

        // Créer le dossier s’il n’existe pas
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Générer un nom de fichier unique
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $uniqueFileName = $originalName . '_' . time() . '_' . uniqid() . '.' . $extension;

        // Déplacer le fichier
        $file->move($destinationPath, $uniqueFileName);

        // Retourner l’URL publique
        return url($relativePath . '/' . $uniqueFileName);
    }

    public function deleteFile(string $path): bool
    {
        $filePath = public_path(trim($path, '/')); // ex: doc/projet/fichier.pdf

        if (file_exists($filePath)) {
            return unlink($filePath);
        }

        return false;
    }
}
