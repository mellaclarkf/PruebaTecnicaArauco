from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import projects, users, estados
from init_scripts.init_db import init_database  # Inicializa la bd
from app.api.endpoints import projects

# Crear tablas y poblar datos iniciales
init_database()

app = FastAPI(title="Project Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, tags=["users"])
app.include_router(projects.router, tags=["projects"])
app.include_router(estados.router, tags=["estados"]) 

@app.get("/")
def read_root():
    return {"message": "Project Portfolio API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
