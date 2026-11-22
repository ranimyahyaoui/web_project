# SC2 Connect

Plateforme du club SC2 (SUP'COM) : activités, réservations, adhésions, espace membre et administration.

## Démarrage

Prérequis : Node.js 22.12+ et npm.

Dans le premier terminal, depuis la racine du projet :

```bash
cd backend
npm install
```

Copier `backend/.env.example` vers `backend/.env`, puis initialiser la base et démarrer l'API :

```bash
npx prisma migrate dev --name init
npx prisma generate
node server.js
```

Dans un second terminal, depuis la racine du projet :

```bash
cd frontend
npm install
npx ng serve
```

L'interface est disponible à `http://localhost:4200` et l'API à `http://localhost:3000/api`.
Le proxy Angular redirige les requêtes `/api` vers le serveur en développement.
Au premier démarrage, l'API peuple automatiquement une base vide avec les données de démonstration.

Les mêmes opérations sont aussi disponibles depuis la racine avec `npm run setup`,
`npm run db:migrate`, `npm run dev:backend` et `npm run dev:frontend`.

Commandes utiles :

| Commande | Fonction |
| --- | --- |
| `npm run db:migrate` | Applique les migrations Prisma |
| `npm run db:seed` | Réinitialise les données de démonstration |
| `npm test` | Exécute les tests d'API sur une base SQLite de test |
| `npm run build` | Compile l'application Angular |

Comptes de démonstration :

| Rôle | Adresse | Mot de passe |
| --- | --- | --- |
| Membre | `yasmine.trabelsi@supcom.tn` | `membre123` |
| Administrateur | `youssef.ayari@supcom.tn` | `admin123` |

## Structure

```text
backend/
  controllers/       Logique des activités, comptes, membres, admin et contact
  lib/               Client Prisma et fonctions partagées
  middlewares/       Authentification, rôles et validation
  prisma/
    migrations/      Historique des changements de schéma
    schema.prisma    Modèle SQLite/Prisma
    seed.js          Données de démonstration
  routes/            Déclaration des endpoints REST
  tests/             Tests d'intégration de l'API
  server.js          Configuration et démarrage Express

frontend/
  src/
    styles.css       Reset, thème et utilitaires à valeurs entre crochets
    app/
      core/          Services API/authentification, gardes et modèles
      components/    Composants partagés, chacun avec son propre fichier CSS
      pages/         Pages Angular, chacune avec son propre fichier CSS
  angular.json       Configuration de compilation Angular
```

## Comment lire le code

Une requête suit ce chemin : la page Angular appelle `core/api.service.ts`, puis
une route Express appelle le middleware et le contrôleur concernés. Le contrôleur
lit ou modifie les données avec Prisma.

- `backend/routes/` relie chaque URL à son contrôleur.
- `backend/middlewares/` vérifie les droits et les données reçues.
- `backend/controllers/` contient les actions de l'API.
- `frontend/src/app/pages/` contient les écrans et leurs fonctionnalités.
- `frontend/src/app/components/` contient les éléments réutilisés par plusieurs écrans.
- `frontend/src/app/core/` contient les appels API, l'authentification et les types.
- Le CSS d'un écran ou d'un composant se trouve à côté de ses fichiers.
- Les classes utilitaires avec crochets restent dans `styles.css` pour éviter les problèmes d'encapsulation Angular.

## Fonctionnalités

- Pages publiques : accueil, activités et détails, calendrier, bureau, à propos et contact.
- Recherche et filtres d'activités.
- Connexion, demande d'adhésion, espaces membre et administrateur.
- Réservations, liste d'attente et annulation avec promotion du prochain membre.
- Gestion des adhésions et des cotisations.
- Styles CSS classiques; Tailwind n'est pas utilisé.

## API

| Méthode | Route | Fonction |
| --- | --- | --- |
| GET | `/api/stats` | Chiffres clés |
| GET | `/api/activities` | Liste filtrable des activités |
| GET | `/api/activities/:slug` | Détail et réservation de l'utilisateur |
| GET | `/api/board`, `/api/news` | Bureau et actualités |
| POST | `/api/contact` | Envoyer un message |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/adhesion` | Demande d'adhésion |
| GET | `/api/auth/me` | Session courante |
| POST | `/api/activities/:slug/reservations` | Réserver (membre) |
| DELETE | `/api/me/reservations/:id` | Annuler (membre) |
| GET | `/api/me/dashboard` | Espace membre |
| GET | `/api/admin/overview` | Tableau de bord admin |
| PATCH | `/api/admin/adhesions/:id` | Valider/refuser une adhésion |
| PATCH | `/api/admin/payments/:userId` | Modifier une cotisation |
