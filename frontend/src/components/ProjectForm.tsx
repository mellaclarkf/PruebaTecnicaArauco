import React, { useState } from "react";

interface ProjectFormProps {
  initialValues: {
    title: string;
    description: string;
  };
  onSubmit: (values: { title: string; description: string }) => void;
  onCancel: () => void;
  editing: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  editing,
}) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "El título es obligatorio.";
    if (form.description.trim().length < 3)
      newErrors.description = "La descripción debe tener al menos 3 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded p-4 mb-6 flex flex-col gap-4 max-w-md"
    >
      <div>
        <input
          type="text"
          placeholder="Título del proyecto"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={`border rounded p-2 w-full ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`border rounded p-2 w-full min-h-[80px] ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editing ? "Guardar cambios" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
