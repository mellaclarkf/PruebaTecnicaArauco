from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import projects, users

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Portfolio API", version="1.0.0")

# Configurar CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(projects.router, prefix="/api/v1", tags=["projects"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Project Portfolio API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
