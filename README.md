# BusDirect – Partie 2

## Présentation du projet

BusDirect est une application web de gestion des trajets et des réservations de bus.

Cette deuxième partie permet de consulter les trajets disponibles, rechercher et filtrer les voyages, gérer les réservations des passagers et organiser une liste d'attente.

L'application utilise JavaScript avec une architecture modulaire pour organiser le code et faciliter sa maintenance.

## Fonctionnalités

### Gestion des trajets
- Affichage des 20 trajets.
- Recherche par ville de départ et ville d'arrivée.
- Filtrage des trajets selon leur statut.
- Pagination avec 6 trajets par page.
- Affichage du nombre de places disponibles.
- Affichage du chiffre d'affaires et du nombre total de passagers.

### Gestion de la cabine
- Affichage de 20 sièges par trajet.
- Identification des sièges libres et occupés.
- Sièges VIP de 1 à 4 avec une majoration de 10 %.
- Réservation d'un siège.
- Modification d'une réservation.
- Annulation d'une réservation.
- Déplacement d'une réservation avec Drag & Drop.

### Liste d'attente
- Inscription d'un passager lorsque le bus est complet.
- Affichage des passagers en attente.
- Suppression d'un passager de la liste d'attente.

### Autres fonctionnalités
- Sauvegarde des données dans LocalStorage.
- Chargement initial des trajets depuis un fichier JSON avec Fetch et Async/Await.
- Validation des informations des passagers.
- Affichage des messages de confirmation et d'erreur.
- Interface responsive adaptée aux différents écrans.

## Technologies utilisées

- HTML5
- Tailwind CSS
- JavaScript (ES6)
- JavaScript Modules (Import / Export)
- Fetch API
- Async / Await
- LocalStorage
- Git et GitHub
- Vite

## Structure du projet

```text
BusDirect-P2/
│
├── index.html
├── cabine.html
│
├── css/
│   └── output.css
│
├── js/
│   ├── store.js
│   ├── validators.js
│   ├── reservations.js
│   ├── render.js
│   ├── main-trajets.js
│   └── main-cabine.js
│
├── data/
│   └── trips.json
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Exemple d'un trajet

Voici un exemple de trajet utilisé dans l'application :

```json
{
  "id": 1,
  "departure": "Safi",
  "destination": "Marrakech",
  "departureTime": "08:00",
  "arrivalTime": "10:30",
  "price": 90,
  "capacity": 20,
  "reservations": [
    {
      "seat": 3,
      "name": "Amine Alaoui",
      "phone": "0612345678"
    }
  ],
  "waitingList": [
    {
      "name": "Sara Bennani",
      "phone": "0623456789"
    }
  ]
}
```

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/HafssaBoukniter/BusDirect-P2.git
```

### 2. Accéder au dossier

```bash
cd BusDirect-P2
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Lancer le projet

```bash
npm run dev
```

Ouvrir ensuite le lien local affiché dans le terminal.

## Organisation du travail

Le projet est organisé avec Git et GitHub en utilisant plusieurs branches :

- `main`
- `dev`
- `feature/architecture-modulaire`
- `feature/recherche`
- `feature/pagination`
- `feature/cabine`
- `feature/modifier-annuler`
- `feature/attente`
- `feature/list-dattente`.

## Outils de gestion et de suivi

- **GitHub :** gestion du code source, des branches, des commits et des Pull Requests.
- **Jira :** organisation des tâches, suivi de l'avancement et répartition du travail.

## Déploiement

Le projet est déployé avec Vercel.

**Lien du site :** À compléter avec le lien Vercel du projet.

## Liens du projet

- **GitHub :** https://github.com/HafssaBoukniter/BusDirect-P2
- **Vercel :** [À compléter](https://busdirect-p2.vercel.app/)
- **Jira :** [À compléter](https://hafssaboukniter2002.atlassian.net/jira/software/projects/KAN/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiM2Q2ZTBhMGRhNmFjNDI1NGI5Nzg0NzVmMWQ4NjNlNTQiLCJwIjoiaiJ9)

---
