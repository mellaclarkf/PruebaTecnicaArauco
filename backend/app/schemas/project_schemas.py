from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    user_id: int
    estado_id: int

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    estado_id: Optional[int] = None

class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    user_id: int
    estado_id: int
    deleted: bool
    class Config:
        from_attributes = True
