import axios, { AxiosError } from 'axios';
import { TokenResponseDTO } from '@/app/types/auth'; // Reutiliza seus tipos

// Define a URL base da sua API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de Requisição: Adiciona o token a todas as chamadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Adiciona o cabeçalho de autorização
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Opcional, mas bom para tratar erros de token expirado no futuro)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Se o token for inválido ou expirado, força o logout
      console.error("Erro de autorização. Deslogando...");
      localStorage.removeItem('authToken');
      // Recarrega a página para o AuthContext atualizar
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;