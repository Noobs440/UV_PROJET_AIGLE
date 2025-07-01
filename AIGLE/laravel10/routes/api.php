<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AffectationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Usecases\{
    ProfileController,
    NotificationController,
    AuthController,
    FileUploadController,
    GestionMotDePasseController,
    ListingController,
    APIAcceuilController,
    ProjectViewController,
    AddController,
    ProjectStatusController,
    SoumissionController,
    RechercheController
};

use App\Http\Controllers\Ressources\{
    TblUniversiteController,
    TblFaculteController,
    TblFiliereController,
    TblCollaborateurController,
    TblSuperviseurController,
    TblNiveauController,
    TblCategorieController,
    TblProjetController,
    TblDocumentController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes d'authentification
Route::middleware('auth:sanctum')->group(function () {
    // Profile routes
    Route::prefix('user')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'getUserProfile');
        Route::put('/update-name', 'updateName');
        Route::put('/email', 'updateEmail');
        Route::put('/update-password', 'updatePassword');
        Route::post('/photo', 'updatePhoto');
    });

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('deconnexion', [AuthController::class, 'deconnexion']);
        
        // Notification routes
        Route::controller(NotificationController::class)->group(function () {
            Route::get('notifications', 'getNotifications');
            Route::post('notifications/read/{id}', 'markAsRead');
            Route::post('notifications/readAll', 'markAllAsRead');
        });
    });
});

// Routes des ressources
Route::prefix('ressources')->group(function () {
    Route::apiResource('universites', TblUniversiteController::class);
    Route::apiResource('facultes', TblFaculteController::class);
    Route::apiResource('filieres', TblFiliereController::class);
    Route::apiResource('collaborateurs', TblCollaborateurController::class);
    Route::apiResource('superviseurs', TblSuperviseurController::class);
    Route::apiResource('niveaux', TblNiveauController::class);
    Route::apiResource('categories', TblCategorieController::class);
    Route::apiResource('projets', TblProjetController::class);
    Route::apiResource('documents', TblDocumentController::class);
});

// Routes des usecases (non authentifiées)
Route::prefix('usecases')->group(function () {
    // Authentication
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('inscription', 'inscription')->middleware('web');
        Route::post('connexion', 'connexion');
        Route::post('verification', 'sendVerificationCode')->middleware('web');
        Route::post('verify', 'verify')->middleware('web');
    });

    // Password management
    Route::prefix('password')->controller(GestionMotDePasseController::class)->group(function () {
        Route::post('sendcode', 'sendVerificationCode');
        Route::post('verificationcode', 'verifyCode');
        Route::post('reset', 'resetPassword');
    });

    // File upload
    Route::prefix('upload')->controller(FileUploadController::class)->group(function () {
        Route::post('/', 'uploadFile');
        Route::post('/delete', 'deleteFile');
    });

    // Search
    Route::prefix('search')->controller(RechercheController::class)->group(function () {
        Route::post('/projets', 'search');
        Route::post('/categories', 'searchCategories');
        Route::post('/documents', 'searchDocuments');
    });

    // Listing
    Route::prefix('listing')->controller(ListingController::class)->group(function () {
        Route::get('/categorie/projets/{id}', 'showProjects');
        Route::get('/projet/documents/{id}', 'ShowDocuments');
        Route::get('/projet/collaborateurs/{id}', 'ShowCollaborators');
        Route::get('/niveau/projets/{id}', 'ShowLevelProjects');
        Route::get('/user/documents/{id}', 'showUserDocuments');
        Route::get('/user/projets/{id}', 'showUserProjects');
        Route::get('/user/approved_projets/{id}', 'showUserApprovedProjects');
        Route::get('/count/', 'countProjectsByStatus');
        Route::get('/getprojectstype', 'getProjectTypes');
    });

    // Homepage
    Route::prefix('acceuil')->controller(APIAcceuilController::class)->group(function () {
        Route::get('/categories', 'index');
        Route::get('/projets', 'listerProjets');
        Route::get('/projets/ordre', 'listerProjetsParDate');
    });

    // Project views
    Route::prefix('addview')->controller(ProjectViewController::class)->group(function () {
        Route::get('/{id}', 'addView');
    });

    // Add documents
    Route::prefix('add')->controller(AddController::class)->group(function () {
        Route::post('doc/projet/{id}', 'ajouterDocument');
    });

    // Project status
    Route::prefix('status')->controller(ProjectStatusController::class)->group(function () {
        Route::get('/approved/pending/{id}', 'approvePendingProject')->middleware('web');
        Route::get('/rejected/pending/{id}', 'rejectPendingProject')->middleware('web');
        Route::get('/pending/{id}', 'PendingProject')->middleware('web');
        Route::put('projects/{id}', 'updateStatus')->middleware('web');
    });

    // Project submission
    Route::prefix('submit')->controller(SoumissionController::class)->group(function () {
        Route::post('/{id}', 'submitProject')->middleware('web');
    });

    // add supervisor
    Route::post('/affecter-superviseur', [AffectationController::class, 'assignerSuperviseur']);
});