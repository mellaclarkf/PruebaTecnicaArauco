import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Usar variable de entorno para la conexión a la BD
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://portfolio_user:portfolio123@db:5432/project_portfolio"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
