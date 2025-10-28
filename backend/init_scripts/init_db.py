# backend/init_scripts/init_db.py

from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import user, estado  # 👈 ajusta si tus modelos están en otros archivos o carpetas


def init_database():
    """
    Crea todas las tablas definidas en los modelos y carga datos iniciales
    (estados + usuario demo) si aún no existen.
    Este script se ejecuta al iniciar el backend por primera vez.
    """
    print(" [init_db] Creando tablas (si no existen)...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # -----------------------------
        # 1️⃣ Poblar tabla de ESTADOS
        # -----------------------------
        estados_iniciales = [
            {"nombre": "Pendiente", "descripcion": "Proyecto pendiente de iniciar"},
            {"nombre": "En Progreso", "descripcion": "Proyecto en desarrollo"},
            {"nombre": "Completado", "descripcion": "Proyecto finalizado"},
            {"nombre": "Cancelado", "descripcion": "Proyecto cancelado"},
        ]

        for data in estados_iniciales:
            existente = db.query(estado.Estado).filter_by(nombre=data["nombre"]).first()
            if not existente:
                db.add(estado.Estado(**data))

        # -----------------------------
        # Crear USUARIO DEMO
        # -----------------------------
        demo_email = "usuario@ejemplo.com"
        demo_nombre = "Usuario Demo"
        user_existente = db.query(user.User).filter_by(email=demo_email).first()

        if not user_existente:
            db.add(user.User(email=demo_email, name=demo_nombre))

        db.commit()
        print("[init_db] Base de datos inicializada correctamente.")

    except Exception as e:
        print(f"[init_db] Error inicializando la base de datos: {e}")
        db.rollback()

    finally:
        db.close()
