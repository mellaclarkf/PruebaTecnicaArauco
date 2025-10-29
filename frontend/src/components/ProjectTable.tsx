import React from 'react';
import { Project } from '@types/project';
import { useAuth } from '@context/AuthContext';

interface Props {
  projects: Project[];
  onEdit?: (p: Project) => void;
  onDelete?: (p: Project) => void;
}

const ProjectTable: React.FC<Props> = ({ projects, onEdit, onDelete }) => {
  const { role } = useAuth();
  const canEdit = role === 'editor';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Nombre</th>
            <th style={th}>Descripción</th>
            <th style={th}>Inicio</th>
            <th style={th}>Término</th>
            {canEdit && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.description ?? '-'}</td>
              <td style={td}>{p.start_date ?? '-'}</td>
              <td style={td}>{p.end_date ?? '-'}</td>
              {canEdit && (
                <td style={td}>
                  <button onClick={() => onEdit?.(p)}>Editar</button>{' '}
                  <button onClick={() => onDelete?.(p)}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td style={td} colSpan={canEdit ? 5 : 4}>Sin proyectos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const th: React.CSSProperties = { textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' };
const td: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '8px' };

export default ProjectTable;
