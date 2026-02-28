export const BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${BASE_URL}/${endpoint}/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${BASE_URL}/${endpoint}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async put(endpoint: string, id: number | string, data: any) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async delete(endpoint: string, id: number | string) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return true;
  },
};
