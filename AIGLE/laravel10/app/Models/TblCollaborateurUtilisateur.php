<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="TblCollaborateurUtilisateur",
 *     type="object",
 *     title="TblCollaborateurUtilisateur",
 *     required={"tbl_utilisateur_id", "tbl_collaborateur_id"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="The unique identifier of the collaborator-user relationship"
 *     ),
 *     @OA\Property(
 *         property="tbl_utilisateur_id",
 *         type="integer",
 *         format="int64",
 *         description="ID of the user"
 *     ),
 *     @OA\Property(
 *         property="tbl_collaborateur_id",
 *         type="integer",
 *         format="int64",
 *         description="ID of the collaborator"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Creation timestamp"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Update timestamp"
 *     )
 * )
 */
class TblCollaborateurUtilisateur extends Model
{
    use HasFactory;

    protected $table = 'tbl_collaborateur_user';

    protected $fillable = [
        'tbl_collaborateur_id',
        'user_id',
    ];
}
