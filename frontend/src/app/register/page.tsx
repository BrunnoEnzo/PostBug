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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Role, UserCreateDTO } from '@/app/types/auth';
import api from '@/app/services/api'; 
import { isAxiosError } from 'axios';

export default function RegisterPage() {
  const [screenName, setScreenName] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<Role>('USER');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const dto: UserCreateDTO = {
      screenName,
      password,
      bio,
      profileImage: null,
      role,
    };

    try {
      await api.post('/auth/register', dto);

      setSuccess('Usuário registrado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      let errorMessage = 'Ocorreu um erro desconhecido.';

      if (isAxiosError(err) && err.response) {
        // Trata erros de validação vindos do GlobalExceptionHandler
        if (err.response.data.fields) {
          const fieldErrors = Object.values(err.response.data.fields).join(' ');
          errorMessage = fieldErrors;
        } else {
          // Trata outros erros do backend (ex: "Screen name already in use")
          errorMessage = err.response.data.error || 'Falha ao registrar.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ paddingBlock: '3rem' }}>
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
            Cadastro
          </Typography>
          <TextField
            margin="dense" 
            required
            fullWidth
            id="screenName"
            label="Nome de Usuário"
            name="screenName"
            autoFocus
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            fullWidth
            name="bio"
            label="Bio (opcional)"
            id="bio"
            multiline
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Tipo de Conta</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Tipo de Conta"
              onChange={(e: SelectChangeEvent) => setRole(e.target.value as Role)}
            >
              <MenuItem value="USER">Usuário</MenuItem>
              <MenuItem value="ADMIN">Administrador</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !!success}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrar'}
          </Button>

           <Link href="/login" passHref>
            <Typography variant="body2" sx={{ textAlign: 'center', cursor: 'pointer' }}>
              {"Já tem uma conta? Faça login"}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}