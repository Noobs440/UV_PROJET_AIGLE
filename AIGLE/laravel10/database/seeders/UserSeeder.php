<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
     

        User::create([
            'nom_user'=>'Dongmo Russel',
            'email'=>'russeldongmo96@gmail.com',
            'password'=> bcrypt('12345678'),
            'tbl_filiere_id'=>'1',
            'role'=>'user'
        ]);

        User::create([
            'nom_user'=>'Jean Jack',
            'email'=>'jean@gmail.com',
            'password'=> bcrypt('1234'),
            'tbl_filiere_id'=>'1',
        ]);

        User::create([
            'nom_user'=>'Fosso Cabrel',
            'email'=>'fossocabrel08@gmail.com',
            'password'=> bcrypt('12345678'),
            'tbl_filiere_id'=>'1',
        ]);

        User::create([
            'nom_user'=>'Gildas Landry',
            'email'=>'gildas@gmail.com',
            'password'=> bcrypt('1234'),
            'role'=>'user',
            'tbl_filiere_id'=>'1',
        ]);

        User::create([
            'nom_user'=>'Michele Serena',
            'email'=>'michelle@gmail.com',
            'password'=> bcrypt('12345678'),
            'tbl_filiere_id'=>'1',
        ]);

        User::create([
            'nom_user'=>'Mike Diogni',
            'email'=>'mikediogni@gmail.com',
            'password'=> bcrypt('12345'),
            'role'=>'admin',
            'tbl_filiere_id'=>'1',
        ]);

        // ✅ Nouveau superviseur
        User::create([
            'nom_user' => 'Superviseur Principal',
            'email' => 'superviseur@gmail.com',
            'password' => bcrypt('superviseur123'),
            'tbl_filiere_id' => '1',
            'role' => 'superviseur'
        ]);
    }
}
