<?php

namespace Database\Seeders;

use App\Models\TblProjet;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crée un projet pour chaque utilisateur existant et ajoute des commentaires
        $users = \App\Models\User::all();
        $images = [
            storage_path('app/public/images/img1.jpeg'),
            storage_path('app/public/images/img2.jpeg'),
            storage_path('app/public/images/img3.jpeg'),
        ];
        $cloudinaryImages = [];
        foreach ($images as $imgPath) {
            if (file_exists($imgPath)) {
                $uploadedPath = Storage::disk('cloudinary')->putFile('images/project', $imgPath);
                $cloudinaryImages[] = Storage::disk('cloudinary')->url($uploadedPath);
            } else {
                $cloudinaryImages[] = null;
            }
        }
        $i = 0;
        foreach ($users as $user) {
            $projet = TblProjet::create([
                'titre_projet' => 'Projet de ' . $user->nom_user,
                'descript_projet' => 'Projet seedé pour ' . $user->nom_user,
                'image' => $cloudinaryImages[$i % count($cloudinaryImages)],
                'soumis' => 1,
                'status' => 'Pending',
                'user_id' => $user->id,
                'tbl_niveau_id' => 1,
                'tbl_categorie_id' => 1,
            ]);
            // Ajoute 2 commentaires à chaque projet, par des utilisateurs différents
            $commentaires = [];
            foreach ($users->random(min(2, $users->count())) as $commentUser) {
                $comment = \App\Models\Comment::create([
                    'project_id' => $projet->id,
                    'user_id' => $commentUser->id,
                    'content' => 'Commentaire de ' . $commentUser->nom_user . ' sur le projet ' . $projet->titre_projet,
                ]);
                $commentaires[] = $comment;
            }
            // Ajoute une réponse à chaque commentaire principal
            foreach ($commentaires as $comment) {
                $replyUser = $users->where('id', '!=', $comment->user_id)->random();
                \App\Models\Comment::create([
                    'project_id' => $projet->id,
                    'user_id' => $replyUser->id,
                    'content' => 'Réponse de ' . $replyUser->nom_user . ' au commentaire #' . $comment->id,
                    'parent_id' => $comment->id,
                ]);
            }
            $i++;
        }

    // Uploader et créer les projets restants avec images locales
    $staticImages = [
        storage_path('app/public/images/img4.jpeg'),
        storage_path('app/public/images/img5.jpeg'),
        storage_path('app/public/images/img6.jpeg'),
        storage_path('app/public/images/img7.jpeg'),
        storage_path('app/public/images/img8.jpeg'),
        storage_path('app/public/images/img9.jpeg'),
        storage_path('app/public/images/img10.jpg'),
    ];
    $staticCloudinary = [];
    foreach ($staticImages as $imgPath) {
        if (file_exists($imgPath)) {
            $uploadedPath = Storage::disk('cloudinary')->putFile('images/project', $imgPath);
            $staticCloudinary[] = Storage::disk('cloudinary')->url($uploadedPath);
        } else {
            $staticCloudinary[] = null;
        }
    }
    $staticIdx = 0;
    // Remplacer chaque 'image' => '/storage/images/imgX.jpeg' par l'URL Cloudinary correspondante
    TblProjet::create([
        'titre_projet'=>'Protection des données personnelles',
        'descript_projet' => 'Développement d une solution de protection des données personnelles en ligne, en utilisant des algorithmes de cryptographie avancée et des protocoles de sécurisation des communications.',
        'image'=> $staticCloudinary[$staticIdx++],
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'3',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'2',
    ]);
    TblProjet::create([
        'titre_projet'=>'Application de vote électronique',
        'descript_projet' => 'Conception d une application de vote électronique sécurisée utilisant la technologie blockchain pour garantir la transparence et lnintégrité des votes, avec des fonctionnalités de vérification de l identité des votants.',
        'image'=> $staticCloudinary[$staticIdx++],
        'status'=>'Pending',
        'soumis'=>'1',
        'user_id'=>'2',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'3',
    ]);
    TblProjet::create([
        'titre_projet'=>'Gestion des chaînes d approvisionnement',
        'descript_projet' => 'Développement d une plateforme de gestion des chaînes d approvisionnement basée sur la blockchain pour suivre et vérifier l authenticité et la provenance des produits tout au long de la chaîne logistique.',
        'image'=> $staticCloudinary[$staticIdx++],
        'soumis'=>'0',
        'status'=>'Approved',
        'user_id'=>'4',
        'tbl_niveau_id'=>'4',
        'tbl_categorie_id'=>'3',
    ]);
    TblProjet::create([
        'titre_projet'=>'Optimisation des réseaux sans fil',
        'descript_projet' => ' Étude et mise en œuvre de techniques d optimisation pour les réseaux sans fil afin d améliorer la couverture, la capacité et la qualité de service, en utilisant des algorithmes de routage avancés.',
        'image'=> $staticCloudinary[$staticIdx++],
        'status'=>'Approved',
        'soumis'=>'0',
        'user_id'=>'2',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'4',
    ]);
    TblProjet::create([
        'titre_projet'=>'Système de gestion de la bande passante',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=> $staticCloudinary[$staticIdx++],
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'4',
    ]);
    TblProjet::create([
        'titre_projet'=>'Analyse prédictive des ventes',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=> $staticCloudinary[$staticIdx++],
        'status'=>'Approved',
        'soumis'=>'1',
        'user_id'=>'3',
        'tbl_niveau_id'=>'4',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet'=>'Application de vote électronique',
        'descript_projet' => 'Conception d une application de vote électronique sécurisée utilisant la technologie blockchain pour garantir la transparence et lnintégrité des votes, avec des fonctionnalités de vérification de l identité des votants.',
        'image'=>'/storage/images/img5.jpeg',
        'status'=>'Pending',
        'soumis'=>'1',
        'user_id'=>'2',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'3',

    ]);

    TblProjet::create([
        'titre_projet'=>'Gestion des chaînes d approvisionnement',
        'descript_projet' => 'Développement d une plateforme de gestion des chaînes d approvisionnement basée sur la blockchain pour suivre et vérifier l authenticité et la provenance des produits tout au long de la chaîne logistique.',
        'image'=>'/storage/images/img6.jpeg',
        'soumis'=>'0',
        'status'=>'Approved',
        'user_id'=>'4',
        'tbl_niveau_id'=>'4',
        'tbl_categorie_id'=>'3',
    ]);

    TblProjet::create([
        'titre_projet'=>'Optimisation des réseaux sans fil',
        'descript_projet' => ' Étude et mise en œuvre de techniques d optimisation pour les réseaux sans fil afin d améliorer la couverture, la capacité et la qualité de service, en utilisant des algorithmes de routage avancés.',
        'image'=>'/storage/images/img7.jpeg',
        'status'=>'Approved',
        'soumis'=>'0',
        'user_id'=>'2',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'4',

    ]);

    TblProjet::create([
        'titre_projet'=>'Système de gestion de la bande passante',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img8.jpeg',
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'4',
    ]);

    TblProjet::create([
        'titre_projet'=>'Analyse prédictive des ventes',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img9.jpeg',
        'status'=>'Approved',
        'soumis'=>'1',
        'user_id'=>'3',
        'tbl_niveau_id'=>'4',
        'tbl_categorie_id'=>'5',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img10.jpg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet'=>'Optimisation des réseaux sans fils',
        'descript_projet' => ' Étude et mise en œuvre de techniques d optimisation pour les réseaux sans fil afin d améliorer la couverture, la capacité et la qualité de service, en utilisant des algorithmes de routage avancés.',
        'image'=>'/storage/images/img5.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'1',
        'tbl_niveau_id'=>'4',
        'tbl_categorie_id'=>'4',

    ]);

    TblProjet::create([
        'titre_projet'=>'Système de gestion de la bande passantes',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img2.jpeg',
        'status'=>'Pending',
        'soumis'=>'1',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet'=>'Analyse prédictive des ventes, stock et achats',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img5.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'3',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'1',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières partie2',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img8.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'2',
    ]);

    TblProjet::create([
        'titre_projet'=>'Analyse prédictive des ventes et achat',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img7.jpeg',
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'3',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'2',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières partie3',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img3.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'3',
    ]);

    TblProjet::create([
        'titre_projet'=>'Analyse prédictive des ventes et achats',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img5.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'3',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'1',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières partie5',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img2.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'2',
    ]);

    TblProjet::create([
        'titre_projet'=>'Gestion des hotels',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img1.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'3',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'3',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières partie4',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img6.jpeg',
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'3',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet'=>'Gestion des hotels et bar',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img5.jpeg',
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'5',
        'tbl_niveau_id'=>'1',
        'tbl_categorie_id'=>'3',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières et economique',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img6.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières partie6',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img1.jpeg',
        'soumis'=>'1',
        'status'=>'Approved',
        'user_id'=>'3',
        'tbl_niveau_id'=>'3',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet'=>'Gestion des hotels et bars',
        'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
        'image'=>'/storage/images/img2.jpeg',
        'soumis'=>'1',
        'status'=>'Rejected',
        'user_id'=>'5',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'3',

    ]);

    TblProjet::create([
        'titre_projet'=>'Détection de fraudes financières et economiques',
        'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
        'image'=>'/storage/images/img6.jpeg',
        'soumis'=>'1',
        'status'=>'Pending',
        'user_id'=>'1',
        'tbl_niveau_id'=>'2',
        'tbl_categorie_id'=>'5',
    ]);

    TblProjet::create([
        'titre_projet' => 'Analyse des tendances de marché',
        'descript_projet' => 'Développement d’un outil d’analyse des tendances du marché utilisant des algorithmes de machine learning pour prédire les mouvements futurs.',
        'image' => '/storage/images/img1.jpeg',
        'soumis'=>'1',
        'status' => 'Approved',
        'user_id' => '1',
        'tbl_niveau_id' => '3',
        'tbl_categorie_id' => '2',
    ]);

    TblProjet::create([
        'titre_projet' => 'Système de recommandation de films',
        'descript_projet' => 'Création d’un système de recommandation de films basé sur les préférences de l’utilisateur et l’historique de visionnage.',
        'image' => '/storage/images/img2.jpeg',
        'soumis'=>'1',
        'status' => 'Rejected',
        'user_id' => '2',
        'tbl_niveau_id' => '5',
        'tbl_categorie_id' => '4',
    ]);

    TblProjet::create([
        'titre_projet' => 'Application de gestion de tâches',
        'descript_projet' => 'Développement d’une application mobile pour la gestion des tâches et des projets avec des fonctionnalités de collaboration en temps réel.',
        'image' => '/storage/images/img3.jpeg',
        'soumis'=>'1',
        'status' => 'Pending',
        'user_id' => '3',
        'tbl_niveau_id' => '7',
        'tbl_categorie_id' => '5',
    ]);

    TblProjet::create([
        'titre_projet' => 'Plateforme de e-commerce',
        'descript_projet' => 'Conception d’une plateforme de commerce électronique avec des options de paiement sécurisées et une interface utilisateur intuitive.',
        'image' => '/storage/images/img4.jpeg',
        'soumis'=>'1',
        'status' => 'Approved',
        'user_id' => '4',
        'tbl_niveau_id' => '8',
        'tbl_categorie_id' => '1',
    ]);

    TblProjet::create([
        'titre_projet' => 'Système de gestion de la santé',
        'descript_projet' => 'Développement d’un système intégré de gestion des dossiers de santé pour les hôpitaux et les cliniques.',
        'image' => '/storage/images/img5.jpeg',
        'soumis'=>'1',
        'status' => 'Rejected',
        'user_id' => '5',
        'tbl_niveau_id' => '10',
        'tbl_categorie_id' => '6',
    ]);

    TblProjet::create([
        'titre_projet' => 'Détection d’intrusion dans les réseaux',
        'descript_projet' => 'Mise en place d’un système de détection d’intrusion pour protéger les réseaux d’entreprise contre les cyberattaques.',
        'image' => '/storage/images/img6.jpeg',
        'soumis'=>'1',
        'status' => 'Pending',
        'user_id' => '1',
        'tbl_niveau_id' => '11',
        'tbl_categorie_id' => '4',
    ]);

    TblProjet::create([
        'titre_projet' => 'Application de fitness',
        'descript_projet' => 'Développement d’une application de suivi de la condition physique et de la nutrition avec des fonctionnalités de coaching personnalisé.',
        'image' => '/storage/images/img7.jpeg',
        'soumis'=>'1',
        'status' => 'Approved',
        'user_id' => '2',
        'tbl_niveau_id' => '9',
        'tbl_categorie_id' => '5',
    ]);

    TblProjet::create([
        'titre_projet' => 'Système de réservation en ligne',
        'descript_projet' => 'Création d’un système de réservation en ligne pour les hôtels et les restaurants avec une gestion intégrée des disponibilités.',
        'image' => '/storage/images/img8.jpeg',
        'soumis'=>'1',
        'status' => 'Rejected',
        'user_id' => '3',
        'tbl_niveau_id' => '4',
        'tbl_categorie_id' => '3',
    ]);

    TblProjet::create([
        'titre_projet' => 'Reconnaissance faciale',

    // Uploader toutes les images restantes et créer les projets avec URL Cloudinary
    $moreImages = [
        storage_path('app/public/images/img5.jpeg'),
        storage_path('app/public/images/img6.jpeg'),
        storage_path('app/public/images/img7.jpeg'),
        storage_path('app/public/images/img8.jpeg'),
        storage_path('app/public/images/img9.jpeg'),
        storage_path('app/public/images/img10.jpg'),
        storage_path('app/public/images/img1.jpeg'),
        storage_path('app/public/images/img2.jpeg'),
        storage_path('app/public/images/img3.jpeg'),
        storage_path('app/public/images/img4.jpeg'),
    ];
    $moreCloudinary = [];
    foreach ($moreImages as $imgPath) {
        if (file_exists($imgPath)) {
            $uploadedPath = Storage::disk('cloudinary')->putFile('images/project', $imgPath);
            $moreCloudinary[] = Storage::disk('cloudinary')->url($uploadedPath);
        } else {
            $moreCloudinary[] = null;
        }
    }
    $idx = 0;
    $projets = [
        [
            'titre_projet'=>'Application de vote électronique',
            'descript_projet' => 'Conception d une application de vote électronique sécurisée utilisant la technologie blockchain pour garantir la transparence et lnintégrité des votes, avec des fonctionnalités de vérification de l identité des votants.',
            'image'=> $moreCloudinary[$idx++],
            'status'=>'Pending',
            'soumis'=>'1',
            'user_id'=>'2',
            'tbl_niveau_id'=>'2',
            'tbl_categorie_id'=>'3',
        ],
        [
            'titre_projet'=>'Gestion des chaînes d approvisionnement',
            'descript_projet' => 'Développement d une plateforme de gestion des chaînes d approvisionnement basée sur la blockchain pour suivre et vérifier l authenticité et la provenance des produits tout au long de la chaîne logistique.',
            'image'=> $moreCloudinary[$idx++],
            'soumis'=>'0',
            'status'=>'Approved',
            'user_id'=>'4',
            'tbl_niveau_id'=>'4',
            'tbl_categorie_id'=>'3',
        ],
        [
            'titre_projet'=>'Optimisation des réseaux sans fil',
            'descript_projet' => ' Étude et mise en œuvre de techniques d optimisation pour les réseaux sans fil afin d améliorer la couverture, la capacité et la qualité de service, en utilisant des algorithmes de routage avancés.',
            'image'=> $moreCloudinary[$idx++],
            'status'=>'Approved',
            'soumis'=>'0',
            'user_id'=>'2',
            'tbl_niveau_id'=>'1',
            'tbl_categorie_id'=>'4',
        ],
        [
            'titre_projet'=>'Système de gestion de la bande passante',
            'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
            'image'=> $moreCloudinary[$idx++],
            'soumis'=>'1',
            'status'=>'Rejected',
            'user_id'=>'1',
            'tbl_niveau_id'=>'2',
            'tbl_categorie_id'=>'4',
        ],
        [
            'titre_projet'=>'Analyse prédictive des ventes',
            'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
            'image'=> $moreCloudinary[$idx++],
            'status'=>'Approved',
            'soumis'=>'1',
            'user_id'=>'3',
            'tbl_niveau_id'=>'4',
            'tbl_categorie_id'=>'5',
        ],
        [
            'titre_projet'=>'Détection de fraudes financières',
            'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
            'image'=> $moreCloudinary[$idx++],
            'soumis'=>'1',
            'status'=>'Approved',
            'user_id'=>'1',
            'tbl_niveau_id'=>'2',
            'tbl_categorie_id'=>'5',
        ],
        [
            'titre_projet'=>'Optimisation des réseaux sans fils',
            'descript_projet' => ' Étude et mise en œuvre de techniques d optimisation pour les réseaux sans fil afin d améliorer la couverture, la capacité et la qualité de service, en utilisant des algorithmes de routage avancés.',
            'image'=> $moreCloudinary[$idx++],
            'soumis'=>'1',
            'status'=>'Approved',
            'user_id'=>'1',
            'tbl_niveau_id'=>'4',
            'tbl_categorie_id'=>'4',
        ],
        [
            'titre_projet'=>'Système de gestion de la bande passantes',
            'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
            'image'=> $moreCloudinary[$idx++],
            'status'=>'Pending',
            'soumis'=>'1',
            'user_id'=>'1',
            'tbl_niveau_id'=>'2',
            'tbl_categorie_id'=>'5',
        ],
        [
            'titre_projet'=>'Analyse prédictive des ventes, stock et achats',
            'descript_projet' => ' Utilisation des techniques de data science et d apprentissage automatique pour analyser les données de ventes historiques et prédire les tendances futures, afin  d aider les entreprises à optimiser leur stratégie commerciale.',
            'image'=> $moreCloudinary[$idx++],
            'soumis'=>'1',
            'status'=>'Approved',
            'user_id'=>'3',
            'tbl_niveau_id'=>'1',
            'tbl_categorie_id'=>'1',
        ],
        [
            'titre_projet'=>'Détection de fraudes financières partie2',
            'descript_projet' => 'Développement d un système de gestion de la bande passante pour les réseaux d entreprise, permettant de prioriser le trafic réseau et d allouer dynamiquement les ressources en fonction des besoins.',
            'image'=> $moreCloudinary[$idx++],
            'soumis'=>'1',
            'status'=>'Approved',
            'user_id'=>'1',
            'tbl_niveau_id'=>'2',
            'tbl_categorie_id'=>'2',
        ],
        // ...ajoute les autres projets ici en suivant le même schéma...
    ];
    foreach ($projets as $projet) {
        TblProjet::create($projet);
    }
