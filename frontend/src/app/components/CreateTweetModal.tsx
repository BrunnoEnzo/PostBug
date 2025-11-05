"use client";

import React, { useState, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/app/services/api';
import { TweetCreateDTO } from '@/app/types/api';

interface CreateTweetModalProps {
  open: boolean;
  onClose: () => void;
  onTweetPosted: () => void; // Para atualizar o feed
}

export default function CreateTweetModal({ open, onClose, onTweetPosted }: CreateTweetModalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    const dto: TweetCreateDTO = { content };

    try {
      await api.post('/tweets', dto);
      setContent(''); // Limpa o campo
      onTweetPosted(); // Avisa o pai para recarregar os tweets
      onClose(); // Fecha o modal
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Falha ao postar tweet.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Limpa o estado ao fechar
  const handleClose = () => {
    setContent('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Criar novo Tweet
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            variant="outlined"
            label="O que está acontecendo?"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            // Adiciona validação de 280 caracteres
            inputProps={{ maxLength: 280 }} 
            helperText={`${content.length}/280`}
          />
          {error && <Alert severity="error" className="mt-4">{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ p: '16px 24px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !content.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Postar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}