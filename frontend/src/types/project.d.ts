export interface Project {
  id: string;
  name: string;
  description?: string;
  start_date?: string;  // ISO
  end_date?: string;    // ISO
  state_id?: string;    // relacion con "estados"
  user_id?: string;     // creador/owner
  created_at?: string;
  updated_at?: string;
}
