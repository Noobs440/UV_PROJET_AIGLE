<?php

use App\Models\TblProjet;
use App\Models\TblCollaborateur;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('collaborateur_projet', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(TblCollaborateur::class)->constrained();
            $table->foreignIdFor(TblProjet::class)->constrained();
            $table->timestamps();

            // Optionnel : index unique pour éviter les doublons
            $table->unique(['tbl_collaborateur_id', 'tbl_projet_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collaborateur_projet');
    }
};
