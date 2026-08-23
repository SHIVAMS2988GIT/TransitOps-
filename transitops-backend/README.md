# TransitOps v1.1

A full-stack fleet operations dashboard using React/Vite, Express and PostgreSQL.

## Start backend

```powershell
cd .\transitops-backend
npm install
npm run dev
```

Keep your existing `.env` file in `transitops-backend`. Do not commit it.

Health check: `http://localhost:5000/api/health`

## Start frontend

Open a second VS Code terminal:

```powershell
cd .\transitops-frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend defaults to `http://localhost:5000/api`. To change it, create `transitops-frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo login

Email: `admin@transitops.com`
Password: `admin123`

If the account already exists, do not run `create-admin` again. If it does not exist:

```powershell
cd .\transitops-backend
node createUser.js
```

## Database

The app expects the existing TransitOps PostgreSQL schema/tables. Use the existing database and seed only when you intentionally want the sample fleet data.

## Important

Do not replace your working backend `.env` with `.env.example`; keep your local credentials.
