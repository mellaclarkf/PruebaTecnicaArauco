import React, { useEffect, useState } from 'react';
import { api } from '@api/apiClient';
import { Project } from '@types/project';
import ProjectTable from '@components/ProjectTable';
import { useAuth } from '@context/AuthContext';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, loginAs, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/projects')
      .then(res => mounted && setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <h2 style={{ marginRight: 'auto' }}>Proyectos</h2>
        {!isAuthenticated ? (
          <>
            <button onClick={() => loginAs('viewer')}>Entrar como Lector</button>
            <button onClick={() => loginAs('editor')}>Entrar como Editor</button>
          </>
        ) : (
          <>
            <span>Rol: <b>{role}</b></span>
            <button onClick={logout}>Salir</button>
          </>
        )}
      </header>

      {loading ? <p>Cargando...</p> : <ProjectTable projects={projects} />}
    </div>
  );
};

export default ProjectList;
