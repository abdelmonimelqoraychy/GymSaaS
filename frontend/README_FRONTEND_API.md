# Frontend GymSaaS connecté au backend Django

Ce frontend n'utilise plus `src/data/mockData.js`.

## API utilisées

- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET /api/members/`
- `GET /api/plans/`
- `GET /api/subscriptions/`
- `GET /api/payments/`

## Lancement local

### Backend

```bash
cd backend
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le proxy Vite envoie automatiquement les requêtes `/api` vers `http://127.0.0.1:8000`.

## Remarque Gym

Le modèle `Gym` existe dans Django, mais le projet actuel ne possède pas encore de route API `Gym`. La page `Ma salle` n'affiche donc pas de fausses données.
