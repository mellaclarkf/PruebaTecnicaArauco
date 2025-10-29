import React, { useEffect, useState } from "react";
import { api } from "@api/apiClient";
import ProjectTable from "@components/ProjectTable";
import ProjectForm from "@components/ProjectForm";
import { useAuth } from "@context/AuthContext";

interface Project {
  id: number;
  title: string;
  description: string;
  user_id: number;
  estado_id: number;
  deleted: boolean;
  name?: string; // usado por ProjectTable
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const { role, loginAs, logout, isAuthenticated } = useAuth();

  // 🔹 Cargar proyectos
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/proyectos/");
      setProjects(res.data);
      setErrorMsg(null);
    } catch {
      setErrorMsg("❌ Error al cargar proyectos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔹 Crear o editar
  const handleSave = async (values: { title: string; description: string }) => {
    try {
      if (editing) {
        await api.patch(`/proyectos/${editing.id}`, {
          title: values.title,
          description: values.description,
          estado_id: editing.estado_id,
        });
      } else {
        await api.post("/proyectos/", {
          title: values.title,
          description: values.description,
          user_id: 1,
          estado_id: 1,
        });
      }
      setShowForm(false);
      setEditing(null);
      fetchProjects();
    } catch {
      setErrorMsg("❌ No se pudo guardar el proyecto.");
    }
  };

  // 🔹 Editar
  const handleEdit = (p: Project) => {
    setEditing(p);
    setShowForm(true);
    setErrorMsg(null);
  };

  // 🔹 Eliminar
  const handleDelete = async (p: Project) => {
    if (!confirm(`¿Eliminar el proyecto "${p.name}"?`)) return;
    try {
      await api.delete(`/proyectos/${p.id}`);
      fetchProjects();
    } catch {
      setErrorMsg("❌ No se pudo eliminar el proyecto.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Cartera de Proyectos</h2>

        {!isAuthenticated ? (
          <div className="flex gap-2">
            <button
              onClick={() => loginAs("viewer")}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Entrar como Lector
            </button>
            <button
              onClick={() => loginAs("editor")}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Entrar como Editor
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span>
              Rol: <b>{role}</b>
            </span>
            <button
              onClick={logout}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Salir
            </button>
          </div>
        )}
      </header>

      {/* Error global */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {errorMsg}
        </div>
      )}

      {/* Botón nuevo */}
      {isAuthenticated && role === "editor" && !showForm && (
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Nuevo Proyecto
        </button>
      )}

      {/* Formulario */}
      {showForm && (
        <ProjectForm
          initialValues={{
            title: editing ? editing.name || editing.title : "",
            description: editing ? editing.description : "",
          }}
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          editing={!!editing}
        />
      )}

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <ProjectTable
          projects={projects.map((p) => ({
            id: p.id,
            name: p.title,
            description: p.description,
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProjectList;
