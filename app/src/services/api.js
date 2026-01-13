import axios from 'axios';

// API Gateway - Load balanced
const API_GATEWAY_URL = 'http://localhost:8084';
const API_COMMAND_URL = `${API_GATEWAY_URL}/api/persons`;
const API_QUERY_URL = `${API_GATEWAY_URL}/api/query`;

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
  // Queries (read from API Gateway -> MongoDB)
  getAll: async () => {
    const response = await queryApi.get('/persons');
    return response.data;
  },

  getById: async (id) => {
    const response = await queryApi.get(`/persons/${id}`);
    return response.data;
  },

  // Commands (write via API Gateway -> Load Balanced)
  create: async (data) => {
    const response = await commandApi.post('', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await commandApi.patch(`/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await commandApi.delete(`/${id}`);
    return response.data;
  },
};

export { API_COMMAND_URL, API_QUERY_URL };
