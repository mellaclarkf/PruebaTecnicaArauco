from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Estado

router = APIRouter()

@router.get("/estados")
def list_estados(db: Session = Depends(get_db)):
    """Listar todos los estados existentes."""
    estados = db.query(Estado).order_by(Estado.id).all()
    return estados


@router.post("/estados", status_code=201)
def create_estado(nombre: str, descripcion: str | None = None, db: Session = Depends(get_db)):
    """Agregar un nuevo estado (opcional, normalmente no se usa en producción)."""
    existe = db.query(Estado).filter(Estado.nombre == nombre).first()
    if existe:
        raise HTTPException(status_code=409, detail="El estado ya existe")

    e = Estado(nombre=nombre, descripcion=descripcion)
    db.add(e)
    db.commit()
    db.refresh(e)
    return e
