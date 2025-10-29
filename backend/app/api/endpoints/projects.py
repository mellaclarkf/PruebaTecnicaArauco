from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db
from app.models import project
from app.schemas import project_schemas

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])


# 🔹 Listar proyectos (solo los que no estén borrados)
@router.get(
    "/",
    response_model=list[project_schemas.ProjectOut],
    summary="Listar proyectos",
    description="Obtiene todos los proyectos activos (no eliminados) registrados en el sistema."
)
def listar_proyectos(db: Session = Depends(get_db)):
    try:
        proyectos = db.query(project.Project).filter(project.Project.deleted == False).all()
        return proyectos
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error al listar los proyectos: {str(e)}")


# 🔹 Crear nuevo proyecto
@router.post(
    "/",
    response_model=project_schemas.ProjectOut,
    status_code=201,
    summary="Crear proyecto",
    description="Crea un nuevo proyecto asignando usuario y estado correspondientes."
)
def crear_proyecto(data: project_schemas.ProjectCreate, db: Session = Depends(get_db)):
    try:
        nuevo_proyecto = project.Project(**data.dict())
        db.add(nuevo_proyecto)
        db.commit()
        db.refresh(nuevo_proyecto)
        return nuevo_proyecto
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el proyecto: {str(e)}")


# 🔹 Actualizar proyecto
@router.patch(
    "/{proyecto_id}",
    response_model=project_schemas.ProjectOut,
    summary="Actualizar proyecto",
    description="Actualiza los datos de un proyecto existente. Solo se permiten campos enviados en la solicitud."
)
def actualizar_proyecto(proyecto_id: int, data: project_schemas.ProjectUpdate, db: Session = Depends(get_db)):
    try:
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

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar el proyecto: {str(e)}")


# 🔹 Borrado lógico
@router.delete(
    "/{proyecto_id}",
    summary="Eliminar proyecto",
    description="Realiza un borrado lógico marcando el proyecto como eliminado en la base de datos."
)
def eliminar_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    try:
        proyecto_db = db.query(project.Project).filter(
            project.Project.id == proyecto_id,
            project.Project.deleted == False
        ).first()

        if not proyecto_db:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")

        proyecto_db.deleted = True
        db.commit()
        return {"message": "Proyecto marcado como eliminado"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar el proyecto: {str(e)}")


# 🔹 OPTIONS (compatibilidad con CORS)
@router.options("/", include_in_schema=False)
async def opciones_proyectos():
    """Ruta auxiliar para solicitudes OPTIONS (CORS)."""
    return {}
