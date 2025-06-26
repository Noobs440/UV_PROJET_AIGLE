<?php

namespace App\Http\Controllers\Usecases;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function inscription(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_user' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:4',
            'tbl_filiere_id' => 'required|exists:tbl_filieres,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $request->session()->put('user_data', $request->only(['nom_user', 'email', 'password', 'tbl_filiere_id']));
        return $this->sendVerificationCode($request->email);
    }

    public function sendVerificationCode($email)
    {
        $verificationCode = Str::random(6);
        session()->put('verification_code', $verificationCode);

        Mail::raw("Votre code de vérification est : $verificationCode", function ($message) use ($email) {
            $message->to($email)->subject('Code de vérification');
        });

        return response()->json(['message' => 'Code de vérification envoyé par e-mail']);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|min:6|max:6',
        ]);

        $verificationCode = $request->session()->get('verification_code');

        if (!$verificationCode) {
            return response()->json(['message' => 'Code de vérification expiré ou non trouvé'], 404);
        }

        if ($request->code !== $verificationCode) {
            return response()->json(['message' => 'Code de vérification incorrect'], 400);
        }

        $userData = $request->session()->get('user_data');

        if (!$userData) {
            return response()->json(['message' => 'Les informations de l\'utilisateur ne sont pas trouvées'], 400);
        }

        $user = User::create([
            'nom_user' => $userData['nom_user'],
            'email' => $userData['email'],
            'tbl_filiere_id' => $userData['tbl_filiere_id'],
            'password' => bcrypt($userData['password']),
            'role' => 'user'
        ]);

        $request->session()->forget(['verification_code', 'user_data']);

        return response()->json([
            'message' => 'Adresse e-mail vérifiée avec succès et utilisateur créé',
            'user' => $user,
            'is_superviseur' => false
        ], 201);
    }

    public function connexion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:4',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $credentials = request(['email', 'password']);
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => "Access non autorisé"], 401);
        }

        $user = User::where('email', $request->email)->first();
        
        $isSuperviseur = ($user->role === 'superviseur');

        $projets = $user->projets()->with('niveau', 'categorie')->get(['titre_projet', 'descript_projet', 'type', 'views', 'status', 'image', 'tbl_niveau_id', 'tbl_categorie_id', 'created_at'])
            ->map(function($projet) {
                return [
                    'titre' => $projet->titre_projet,
                    'description' => $projet->descript_projet,
                    'type' => $projet->type,
                    'views' => $projet->views,
                    'image' => $projet->image,
                    'status' => $projet->status,
                    'niveau' => $projet->niveau->code_niv,
                    'categorie' => $projet->categorie->nom_cat,
                    'created_at' => $projet->created_at,
                ];
            });

        $tokenResult = $user->createToken('authToken')->plainTextToken;

        // Modification clé ici pour la redirection du superviseur
        $redirectTo = match($user->role) {
            'admin' => '/admin',
            'superviseur' => '/enseignant/dashboard', // Redirection vers le dashboard enseignant
            default => '/dashboard'
        };

        return response()->json([
            'message' => 'Access autorisé',
            'access_token' => $tokenResult,
            'token_type' => 'Bearer',
            'username' => $user->nom_user,
            'role' => $user->role,
            'id' => $user->id,
            'projets' => $projets,
            'is_superviseur' => $isSuperviseur,
            'redirect_to' => $redirectTo
        ], 200);
    }

    public function deconnexion(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.'], 200);
    }
}