from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db
from app.models import Estado

router = APIRouter()


@router.get(
    "/estados",
    summary="Listar estados",
    description="Obtiene todos los estados existentes ordenados por su identificador."
)
def list_estados(db: Session = Depends(get_db)):
    """Listar todos los estados existentes."""
    try:
        estados = db.query(Estado).order_by(Estado.id).all()
        return estados
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los estados: {str(e)}")


@router.post(
    "/estados",
    status_code=201,
    summary="Crear estado",
    description="Agrega un nuevo estado al sistema. Esta operación suele usarse solo en entornos de administración."
)
def create_estado(
    nombre: str = Query(..., description="Nombre único del estado."),
    descripcion: str | None = Query(None, description="Descripción opcional del estado."),
    db: Session = Depends(get_db)
):
    try:
        existe = db.query(Estado).filter(Estado.nombre == nombre).first()
        if existe:
            raise HTTPException(status_code=409, detail="El estado ya existe")

        nuevo_estado = Estado(nombre=nombre, descripcion=descripcion)
        db.add(nuevo_estado)
        db.commit()
        db.refresh(nuevo_estado)
        return nuevo_estado

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el estado: {str(e)}")
