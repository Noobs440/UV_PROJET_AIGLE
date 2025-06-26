<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="TblSuperviseur",
 *     type="object",
 *     title="TblSuperviseur",
 *     required={"nom_sup", "email_sup"},
 *     @OA\Property(
 *         property="role",
 *         type="string",
 *         enum={"superviseur", "admin", "user"},
 *         default="superviseur",
 *         description="Role (superviseur par défaut mais autres rôles possibles)"
 *     )
 * )
 */
class TblSuperviseur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_sup',
        'email_sup',
        'role' // Champ modifiable manuellement
    ];

    protected $attributes = [
        'role' => 'superviseur' // Valeur par défaut
    ];

    public static function availableRoles(): array
    {
        return ['superviseur', 'admin', 'user'];
    }

    // Relations existantes
    public function users()
    {
        return $this->belongsToMany(User::class, 'superviseur_utilisateurs');
    }

    public function projets()
    {
        return $this->belongsToMany(TblProjet::class, 'projet_superviseurs');
    }

    // Sécurisation des rôles
    public function setRoleAttribute($value)
    {
        $this->attributes['role'] = in_array($value, self::availableRoles()) 
            ? $value 
            : 'superviseur'; // Fallback sécurisé
    }
}