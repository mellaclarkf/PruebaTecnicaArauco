# Project Portfolio — Full Stack App

Aplicación full stack desarrollada con **FastAPI (Python)** en el backend y **React + TypeScript (Vite)** en el frontend.  
Permite gestionar proyectos, usuarios y estados con una arquitectura limpia y contenedorizada en Docker.

---

## 🚀 Tecnologías principales

| Componente | Tecnología |
|-------------|-------------|
| **Backend** | FastAPI + SQLAlchemy + PostgreSQL |
| **Frontend** | React + TypeScript + Vite + Axios |
| **Base de Datos** | PostgreSQL 15 |
| **Contenedores** | Docker + Docker Compose |

---
Requisitos previos
- Tener instalado:
  - [Docker Desktop](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

Verifica con:
``bash
  docker -v
  docker compose version

  git clone https://github.com/mellaclarkf/PruebaTecnicaArauco.git
  
  cd project-portfolio

  docker compose up --build

  Esto construirá y levantará los 3 servicios: (OJO CON LOS PUERTOS)

  PostgreSQL en el puerto 5432
  
  Backend (FastAPI) en http://localhost:8000
  
  Frontend (React) en http://localhost:3001


  Verificación de servicios
    Servicio	URL	Descripción
    Backend (API)	http://localhost:8000
    
  Documentación Swagger	http://localhost:8000/docs
  
   Interfaz interactiva de la API
      Frontend (Vite React)	http://localhost:3001
    	Interfaz de usuario

## 📂 Estructura del proyecto

project-portfolio/
├── docker-compose.yml
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   │
│   ├── init_scripts/
│   │   ├── 01-init.sql
│   │   └── init_db.py
│   │
│   └── app/
│       ├── main.py
│       ├── database.py
│       │
│       ├── api/
│       │   ├── __init__.py
│       │   └── endpoints/
│       │       ├── __init__.py
│       │       ├── projects.py
│       │       ├── users.py
│       │       └── estados.py
│       │
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── project.py
│       │   └── estado.py
│       │
│       └── schemas/
│           ├── __init__.py
│           ├── user_schemas.py
│           └── project_schemas.py
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   ├── .env
│   │
│   └── src/
│       ├── index.tsx
│       ├── index.css
│       │
│       ├── api/
│       │   └── apiClient.ts        # Axios configurado con baseURL
│       │
│       ├── context/
│       │   └── AuthContext.tsx     # Manejo simple de roles (viewer/editor)
│       │
│       ├── types/
│       │   └── project.d.ts
│       │
│       ├── components/
│       │   ├── ProjectTable.tsx
│       │   ├── ProjectForm.tsx
│       │   └── ...
│       │
│       ├── pages/
│       │   ├── ProjectList.tsx     # CRUD de proyectos (vista principal)
│       │   └── UserList.tsx        # CRUD de usuarios (vista secundaria)
│       │
│       └── App.tsx                 # Enrutador principal
│
└── README.md                       # Documentación del proyecto
│
└── volumes/
    └── pgdata/   # volumen persistente de PostgreSQL (creado automáticamente)



