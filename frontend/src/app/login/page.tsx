"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const [screenName, setScreenName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ screenName, password });
      // Se o login for bem-sucedido, redireciona para a home
      router.push('/'); 
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // O CONTAINER FOI LIMPO. O 'sx' de layout foi removido.
    // A tag <main> em globals.css agora controla o espaçamento e centralização.
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: '100%', 
                p: 3,  
                borderRadius: 2, 
                boxShadow: 3,    
                border: '1px solid', 
                borderColor: 'divider', 
                backgroundColor: '#ffffff', 
            }}
        >
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
                Login
            </Typography>
          <TextField
            margin="dense" // <-- Campos compactos
            required
            fullWidth
            id="screenName"
            label="Nome de Usuário"
            name="screenName"
            autoComplete="username"
            autoFocus
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
          />
          <TextField
            margin="dense" // <-- Campos compactos
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          
          <Link href="/register" passHref>
            <Typography variant="body2" sx={{ textAlign: 'center', cursor: 'pointer' }}>
              {"Não tem uma conta? Cadastre-se"}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}