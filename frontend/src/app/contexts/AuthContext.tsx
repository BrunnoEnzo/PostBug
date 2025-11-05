"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthDTO, TokenResponseDTO } from '@/app/types/auth';
import api from '@/app/services/api'; // Importa o serviço centralizado
import { isAxiosError } from 'axios';   // Helper para identificar erros do axios

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (credentials: AuthDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ao carregar a aplicação, verifica se há um token no localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (credentials: AuthDTO) => {
    try {
      // Usa o 'api.post' em vez do 'fetch'
      const response = await api.post<TokenResponseDTO>('/auth/login', credentials);

      // No axios, a resposta já vem como JSON em 'response.data'
      const newToken = response.data.token;

      setToken(newToken);
      setIsLoggedIn(true);
      localStorage.setItem('authToken', newToken); // Salva o token
    
    } catch (error) {
      console.error("Erro no login:", error);
      
      // Tratamento de erro melhorado com Axios
      let errorMessage = 'Falha no login. Verifique suas credenciais.';
      if (isAxiosError(error) && error.response) {
        // Pega a mensagem de erro do backend (ex: "User not found" ou erro de senha)
        errorMessage = error.response.data.error || errorMessage;
      }
      // Lança o erro para o componente de login poder tratá-lo
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('authToken'); // Remove o token
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};