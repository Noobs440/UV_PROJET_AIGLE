# UV_PROJET_AIGLE

//COTE BACKEND pour le dossier LARAVEL10

Application web de gestion et d'archivage des projets de fin d’études du Département d’Informatique de l’Université de Dschang.

---

## Technologies utilisées

- [Laravel](https://laravel.com/) 10+
- [PHP](https://www.php.net/)
- [MySQL](https://www.mysql.com/)
- [Node.js](https://nodejs.org/)
- [Vite](https://vitejs.dev/) ou Laravel Mix
- [Bootstrap](https://getbootstrap.com/)
- [Angular/Ionic (si applicable)]

---

## Prérequis

Avant de lancer le projet, assure-toi d’avoir installé :

- PHP ≥ 8.1
- Composer
- Node.js + npm
- MySQL ou un autre SGBD compatible

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Noobs440/UV_PROJET_AIGLE.git
cd ton-projet/AIGLE/laravel10
```

---

### 2. Installer les dépendances PHP

```bash
composer install
```

---

### 3. Installer les dépendances Node (pour Vite/Mix)

```bash
npm install
```

---

### 4. Créer le fichier `.env`

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```
---

### 5. Générer la clé d'application

```bash
php artisan key:generate
```

---

### 6. Lier le dossier de stockage (optionnel)

```bash
php artisan storage:link
```

---

### 7. Migrer la base de données (si applicable)

```bash
php artisan migrate --seed
```

---

### 8. Compiler les assets frontend

```bash
npm run dev      # En mode développement
# ou
npm run build    # Pour la version de production
```

---

## Lancer le serveur

```bash
php artisan serve
```

Visite ensuite [http://localhost:8000](http://localhost:8000)

---

## Structure ignorée volontairement (.gitignore)

Les fichiers suivants ne sont pas suivis par Git, mais sont générés localement :

- `.env` → à créer manuellement (Prendre pour exemple le fichier .env.example)
- `node_modules/` → via `npm install`
- `vendor/` → via `composer install`
- `public/build/` → via `npm run build`
- `public/hot`, `storage/*.key`, etc.

---

//Pour le FRONTEND

# 🎓 UV_PROJET_AIGLE - Frontend Angular

Interface utilisateur de la plateforme de gestion et d’archivage des rapports de projets (UV_PROJET_AIGLE), développée avec Angular.

---

## 📁 Structure du projet

Ce frontend est construit avec **Angular**, et consomme une API Laravel située dans le dossier `AIGLE/laravel10`.

## 1- Acceder au dossier du projet
cd UV_PROJET_AIGLE/AIGLE/UV_PROJET_FRONTEND

## 2- Installer les dependances

npm install

## 3- Lancer le serveur

ng serve

## Par défaut, l'application tourne sur http://localhost:4200/.


## Commandes utiles

| Commande              | Description                       |
|----------------------|-----------------------------------|
| `php artisan migrate`| Exécuter les migrations           |
| `php artisan db:seed`| Peupler la BDD                    |
| `npm run dev`        | Lancer Vite/Mix en dev            |
| `npm run build`      | Compiler les assets pour prod     |

---

## 👨‍💻 Auteurs

- Projet universitaire réalisé par les étudiants du Département Informatique – Université de Dschang


