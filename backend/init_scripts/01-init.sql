-- Crear extensiones si es necesario
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insertar estados predeterminados
INSERT INTO estados (nombre, descripcion) VALUES
('Pendiente', 'Proyecto pendiente de iniciar'),
('En Progreso', 'Proyecto en desarrollo'),
('Completado', 'Proyecto finalizado'),
('Cancelado', 'Proyecto cancelado')
ON CONFLICT DO NOTHING;

-- Insertar usuario demo
INSERT INTO users (email, name) VALUES
('usuario@ejemplo.com', 'Usuario Demo')
ON CONFLICT DO NOTHING;
