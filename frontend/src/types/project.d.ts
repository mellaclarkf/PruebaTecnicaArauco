export interface Project {
  id: string;
  name: string;
  description?: string;
  start_date?: string;  // 
  end_date?: string;    // 
  state_id?: string;    // relacion con "estados"
  user_id?: string;     // creador/owner
  created_at?: string;
  updated_at?: string;
}
