# API Endpoints - Blog MERN

Ce fichier recense tous les endpoints exposés par l'API (backend).

## Base

- **GET** `/` : point d'entrée du serveur — message d'accueil

## Auth (`/api/auth`)

- **POST** `/api/auth/register` : `register` (enregistrement d'un utilisateur)
- **POST** `/api/auth/login` : `login` (connexion / obtention de token)

Les routes ci-dessous sont protégées par le middleware `protect` (nécessitent une authentification) :

- **POST** `/api/auth/logout` : `logout` (déconnexion)
- **GET** `/api/auth/me` : `getMe` (récupérer les informations de l'utilisateur connecté)
- **PATCH** `/api/auth/update-me` : `updateMe` (mettre à jour le profil de l'utilisateur)
- **PATCH** `/api/auth/update-password` : `updatePassword` (changer le mot de passe)

## Articles (`/api/articles`)

- **GET** `/api/articles/published` : `getPublishedArticles` (liste des articles publiés)
- **GET** `/api/articles/` : `getAllArticles` (liste de tous les articles)
- **GET** `/api/articles/:id` : `getArticleById` (détails d'un article)

Les routes ci-dessous sont protégées par le middleware `protect` (nécessitent une authentification) :

- **POST** `/api/articles/` : `createArticle` (créer un article)
- **PATCH** `/api/articles/:id` : `updateArticle` (mettre à jour un article)
- **DELETE** `/api/articles/:id` : `deleteArticle` (supprimer un article)
- **PATCH** `/api/articles/:id/publish` : `publishArticle` (publier/unpublier)

## Comments (`/api/comments`)

- **POST** `/api/comments/:articleId` : `createComment` (ajouter un commentaire à un article)
- **GET** `/api/comments/` : `getAllComments` (tous les commentaires)
- **GET** `/api/comments/:articleId` : `getCommentsByArticle` (commentaires d'un article)
- **DELETE** `/api/comments/:id` : `deleteComment` (supprimer un commentaire)
- **PATCH** `/api/comments/:id` : `updateComment` (mettre à jour un commentaire)

## Notes

- Les routes sont montées dans `src/server.js` :
  - `app.use('/api/auth', authRoutes)`
  - `app.use('/api/articles', articleRoutes)`
  - `app.use('/api/comments', commentRoutes)`
- Le middleware `protect` se trouve dans `src/middleware/auth.js` et protège les routes POST/PUT/DELETE/patch pour les articles, et la route `/api/auth/logout`.
