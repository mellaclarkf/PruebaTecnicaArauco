from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import projects, users, estados
from init_scripts.init_db import init_database  # Inicializa la bd

app = FastAPI(title="Project Portfolio API", version="1.0.0")

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o ["http://localhost:3001"] si prefieres limitarlo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# rutas
app.include_router(users.router, tags=["users"])
app.include_router(projects.router, tags=["projects"])
app.include_router(estados.router, tags=["estados"])

# 
init_database()

@app.get("/")
def read_root():
    return {"message": "Project Portfolio API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.options("/test-cors")
def test_cors():
    return {"ok": True}
