from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.user_schemas import UserCreate, UserOut

router = APIRouter()

@router.get("/usuarios", response_model=list[UserOut], 
                summary="Listar usuarios",
                description="Obtiene todos los usuarios registrados en el sistema.")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/usuarios", response_model=UserOut, status_code=201,
                 summary="Crear usuario",
                description="Crea un nuevo usuario registrando su nombre y correo electrónico.",
                response_description="Usuario creado exitosamente."
             )
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=409, detail="El email ya está registrado")
    u = User(email=payload.email, name=payload.name)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u
