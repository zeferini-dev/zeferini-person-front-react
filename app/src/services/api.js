import axios from 'axios';

const API_COMMAND_URL = 'http://localhost:3000';
const API_QUERY_URL = 'http://localhost:3001';

const commandApi = axios.create({
  baseURL: API_COMMAND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const queryApi = axios.create({
  baseURL: API_QUERY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const personService = {
  // Queries (read from MongoDB port 3001)
  getAll: async () => {
    const response = await queryApi.get('/persons');
    return response.data;
  },

  getById: async (id) => {
    const response = await queryApi.get(`/persons/${id}`);
    return response.data;
  },

  // Commands (write to MySQL port 3000)
  create: async (data) => {
    const response = await commandApi.post('/persons', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await commandApi.patch(`/persons/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await commandApi.delete(`/persons/${id}`);
    return response.data;
  },
};

export { API_COMMAND_URL, API_QUERY_URL };
