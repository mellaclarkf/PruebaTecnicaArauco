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

  // 🔹 Cargar proyectos
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

  // 🔹 Guardar (crear o editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        // 🔄 Actualizar proyecto existente
        await api.patch(`/proyectos/${editing.id}`, {
          title: form.title,
          description: form.description,
          estado_id: form.estado_id,
        });
      } else {
        // ➕ Crear nuevo proyecto
        await api.post("/proyectos/", form);
      }

      // 🔁 Refrescar lista y limpiar formulario
      setShowForm(false);
      setEditing(null);
      setForm({ title: "", description: "", user_id: 1, estado_id: 1 });
      fetchProjects();
    } catch (err) {
      console.error("Error al guardar proyecto:", err);
    }
  };

  // 🔹 Editar proyecto
  const handleEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.name,
      description: p.description,
      user_id: p.user_id,
      estado_id: p.estado_id,
    });
    setShowForm(true);
  };

  // 🔹 Eliminar proyecto
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
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ flex: 1 }}>Cartera de Proyectos</h2>
        {!isAuthenticated ? (
          <>
            <button onClick={() => loginAs("viewer")}>Entrar como Lector</button>
            <button onClick={() => loginAs("editor")}>Entrar como Editor</button>
          </>
        ) : (
          <>
            <span>Rol: <b>{role}</b></span>
            <button onClick={logout}>Salir</button>
          </>
        )}
      </header>

      {isAuthenticated && role === "editor" && !showForm && (
        <button
          onClick={() => {
            setEditing(null);
            setForm({ title: "", description: "", user_id: 1, estado_id: 1 });
            setShowForm(true);
          }}
        >
          + Nuevo Proyecto
        </button>
      )}

      {showForm && (
        <form
          key={editing ? editing.id : "new"}
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 400,
            marginBottom: 20,
          }}
        >
          <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit">
            {editing ? "Guardar cambios" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditing(null);
              setForm({ title: "", description: "", user_id: 1, estado_id: 1 });
            }}
          >
            Cancelar
          </button>
        </form>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ProjectTable
          projects={projects.map((p) => ({
            id: p.id,
            name: p.title,
            description: p.description,
            start_date: "",
            end_date: "",
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProjectList;
