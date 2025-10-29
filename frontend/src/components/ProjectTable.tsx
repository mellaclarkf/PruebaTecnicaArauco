import React from "react";
import { useAuth } from "@context/AuthContext";

interface ProjectRow {
  id: number;
  name: string;
  description: string;
}

interface Props {
  projects: ProjectRow[];
  onEdit?: (p: ProjectRow) => void;
  onDelete?: (p: ProjectRow) => void;
}

const ProjectTable: React.FC<Props> = ({ projects, onEdit, onDelete }) => {
  const { role } = useAuth();
  const canEdit = role === "editor";

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 border-b">Título</th>
            <th className="text-left p-3 border-b">Descripción</th>
            {canEdit && <th className="text-left p-3 border-b">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{p.name}</td>
                <td className="p-3 border-b">{p.description}</td>
                {canEdit && (
                  <td className="p-3 border-b">
                    <button
                      onClick={() => onEdit?.(p)}
                      className="mr-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete?.(p)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={canEdit ? 3 : 2}
                className="p-4 text-center text-gray-500"
              >
                No hay proyectos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
