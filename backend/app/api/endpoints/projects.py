from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models import project, User, Estado
from app.schemas.project_schemas import ProjectCreate, ProjectUpdate, ProjectOut
from typing import List

router = APIRouter()#prefix="/proyectos", tags=["proyectos"]


@router.get("/", response_model=List[ProjectOut])
def listar_proyectos(db: Session = Depends(get_db)):
    return db.query(project.Project).filter(project.Project.is_active == True).all()


@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def crear_proyecto(data: ProjectCreate, db: Session = Depends(get_db)):
    nuevo = project.Project(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.patch("/{proyecto_id}", response_model=ProjectOut)
def actualizar_proyecto(proyecto_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    existente = db.query(project.Project).filter_by(id=proyecto_id, is_active=True).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(existente, key, value)

    db.commit()
    db.refresh(existente)
    return existente


@router.delete("/{proyecto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    existente = db.query(project.Project).filter_by(id=proyecto_id, is_active=True).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    existente.is_active = False
    db.commit()
    return None
