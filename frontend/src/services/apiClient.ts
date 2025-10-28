const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = {
  get: (endpoint: string) => 
    fetch(`${API_BASE_URL}${endpoint}`).then(handleResponse),
  
  post: (endpoint: string, data: any) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  patch: (endpoint: string, data: any) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  delete: (endpoint: string) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    }).then(handleResponse),
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
