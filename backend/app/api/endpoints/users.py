from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db
from app.models import User
from app.schemas.user_schemas import UserCreate, UserOut

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


# 🔹 Listar usuarios
@router.get(
    "/",
    response_model=list[UserOut],
    summary="Listar usuarios",
    description="Obtiene todos los usuarios registrados en el sistema.",
    response_description="Lista completa de usuarios registrados."
)
def list_users(db: Session = Depends(get_db)):
    try:
        usuarios = db.query(User).all()
        return usuarios
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los usuarios: {str(e)}")


# 🔹 Crear usuario
@router.post(
    "/",
    response_model=UserOut,
    status_code=201,
    summary="Crear usuario",
    description="Crea un nuevo usuario registrando su nombre y correo electrónico.",
    response_description="Usuario creado exitosamente."
)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        # Verificar si el correo ya está registrado
        exists = db.query(User).filter(User.email == payload.email).first()
        if exists:
            raise HTTPException(status_code=409, detail="El email ya está registrado")

        nuevo_usuario = User(email=payload.email, name=payload.name)
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return nuevo_usuario

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el usuario: {str(e)}")
