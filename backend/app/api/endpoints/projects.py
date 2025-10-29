from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import project
from app.schemas import project_schemas

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])

# 🔹 Listar proyectos (solo los que no estén borrados)
@router.get("/", response_model=list[project_schemas.ProjectOut])
def listar_proyectos(db: Session = Depends(get_db)):
    proyectos = db.query(project.Project).filter(project.Project.deleted == False).all()
    return proyectos


# 🔹 Crear nuevo proyecto
@router.post("/", response_model=project_schemas.ProjectOut)
def crear_proyecto(data: project_schemas.ProjectCreate, db: Session = Depends(get_db)):
    nuevo_proyecto = project.Project(**data.dict())
    db.add(nuevo_proyecto)
    db.commit()
    db.refresh(nuevo_proyecto)
    return nuevo_proyecto


# 🔹 Actualizar proyecto
@router.patch("/{proyecto_id}", response_model=project_schemas.ProjectOut)
def actualizar_proyecto(proyecto_id: int, data: project_schemas.ProjectUpdate, db: Session = Depends(get_db)):
    proyecto_db = db.query(project.Project).filter(
        project.Project.id == proyecto_id,
        project.Project.deleted == False
    ).first()

    if not proyecto_db:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(proyecto_db, key, value)

    db.commit()
    db.refresh(proyecto_db)
    return proyecto_db


# 🔹 Borrado lógico
@router.delete("/{proyecto_id}")
def eliminar_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    proyecto_db = db.query(project.Project).filter(
        project.Project.id == proyecto_id,
        project.Project.deleted == False
    ).first()

    if not proyecto_db:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    proyecto_db.deleted = True
    db.commit()
    return {"message": "Proyecto marcado como eliminado"}

@router.options("/", include_in_schema=False)
async def opciones_proyectos():
    return {}
