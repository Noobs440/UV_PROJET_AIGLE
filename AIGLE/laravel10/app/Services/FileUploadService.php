<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Upload un fichier dans le dossier public/images/project ou autre.
     *
     * @param UploadedFile $file
     * @param string $relativePath - Exemple : 'images/project'
     * @return string URL publique
     */
    public function uploadFile(UploadedFile $file, string $relativePath): string
    {
        // Stocker le fichier sur Cloudinary (le chemin relatif est utilisé comme dossier)
        $path = Storage::disk('cloudinary')->put($relativePath, $file);
        // Récupérer l'URL publique du fichier
        $url = Storage::disk('cloudinary')->url($path);
        return $url;
    }

    /**
     * Supprime un fichier à partir de son URL publique complète ou chemin relatif
     *
     * @param string $publicUrl
     * @return bool
     */
    public function deleteFile(string $publicUrl): bool
    {
        // Extraire le chemin Cloudinary à partir de l'URL
        // Cloudinary URLs are like: https://res.cloudinary.com/<cloud_name>/.../upload/v<version>/<folder>/<filename>
        // We'll try to extract the path after '/upload/'
        $parts = explode('/upload/', $publicUrl, 2);
        if (count($parts) !== 2) {
            return false;
        }
        $cloudinaryPath = $parts[1];
        // Remove version prefix if present (e.g., v1234567890/)
        $cloudinaryPath = preg_replace('#^v[0-9]+/#', '', $cloudinaryPath);
        // Remove query string if present
        $cloudinaryPath = strtok($cloudinaryPath, '?');
        // Supprimer le fichier du disque cloudinary
        return Storage::disk('cloudinary')->delete($cloudinaryPath);
    }
}
