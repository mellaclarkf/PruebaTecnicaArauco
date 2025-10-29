import React, { useEffect, useState } from "react";
import { api } from "@api/apiClient";
import ProjectTable from "@components/ProjectTable";
import { useAuth } from "@context/AuthContext";

interface Project {
  id: number;
  title: string;
  description: string;
  user_id: number;
  estado_id: number;
  deleted: boolean;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    user_id: 1,
    estado_id: 1,
  });

  const { role, loginAs, logout, isAuthenticated } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/proyectos/");
      setProjects(res.data);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/proyectos/${editing.id}`, {
          title: form.title,
          description: form.description,
          estado_id: form.estado_id,
        });
      } else {
        await api.post("/proyectos/", form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: "", description: "", user_id: 1, estado_id: 1 });
      fetchProjects();
    } catch (err) {
      console.error("Error al guardar proyecto:", err);
    }
  };

  const handleEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      user_id: p.user_id,
      estado_id: p.estado_id,
    });
    setShowForm(true);
  };

  const handleDelete = async (p: Project) => {
    if (!confirm(`¿Eliminar el proyecto "${p.title}"?`)) return;
    try {
      await api.delete(`/proyectos/${p.id}`);
      fetchProjects();
    } catch (err) {
      console.error("Error al eliminar proyecto:", err);
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

      {/* Nuevo proyecto */}
      {isAuthenticated && role === "editor" && !showForm && (
        <button
          onClick={() => {
            setEditing(null);
            setForm({ title: "", description: "", user_id: 1, estado_id: 1 });
            setShowForm(true);
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Nuevo Proyecto
        </button>
      )}

      {/* Formulario */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-4 mb-6 flex flex-col gap-4 max-w-md"
        >
          <input
            type="text"
            placeholder="Título del proyecto"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 focus:outline-blue-500"
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded p-2 focus:outline-blue-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editing ? "Guardar cambios" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setForm({ title: "", description: "", user_id: 1, estado_id: 1 });
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
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
