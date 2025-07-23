<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\TblProjet;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_collaborateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom_collab');
            $table->string('email_collab');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('tbl_projet_id');
            $table->timestamps();
            $table->unique(['nom_collab', 'email_collab', 'user_id', 'tbl_projet_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('tbl_projet_id')->references('id')->on('tbl_projets')->onDelete('cascade');
        });



    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_collaborateurs');
    }
};
