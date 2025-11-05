"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/app/services/api';
// Importamos os tipos de Tweet e o novo DTO de atualização
import { TweetResponseDTO, TweetUpdateDTO } from '@/app/types/api';

interface EditTweetModalProps {
  open: boolean;
  onClose: () => void;
  // Função para notificar o 'pai' (TweetFeed) que o tweet foi atualizado
  onTweetUpdated: (updatedTweet: TweetResponseDTO) => void; 
  tweetToEdit: TweetResponseDTO | null; // O tweet que estamos editando
}

export default function EditTweetModal({ 
  open, 
  onClose, 
  onTweetUpdated, 
  tweetToEdit 
}: EditTweetModalProps) {
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Este 'useEffect' é crucial:
  // Ele atualiza o estado 'content' interno do modal
  // sempre que o modal é aberto com um novo 'tweetToEdit'.
  useEffect(() => {
    if (open && tweetToEdit) {
      setContent(tweetToEdit.content);
    }
    // Limpa o erro ao abrir
    if (open) {
      setError(null);
    }
  }, [open, tweetToEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !tweetToEdit) return;

    setLoading(true);
    setError(null);
    const dto: TweetUpdateDTO = { content }; // DTO de atualização

    try {
      // Usamos api.put e o ID do tweet
      const response = await api.put<TweetResponseDTO>(`/tweets/${tweetToEdit.id}`, dto);
      
      onTweetUpdated(response.data); // Passa o tweet atualizado de volta para o Feed
      onClose(); // Fecha o modal

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Falha ao editar tweet.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Editar Tweet
        <IconButton
          aria-label="close"
          onClick={onClose}
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
            label="Edite seu tweet..."
            multiline
            rows={4}
            value={content} // Controlado pelo estado
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            inputProps={{ maxLength: 280 }}
            helperText={`${content.length}/280`}
          />
          {error && <Alert severity="error" className="mt-4">{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // Desabilita se estiver carregando, vazio ou se o conteúdo não mudou
            disabled={loading || !content.trim() || content === tweetToEdit?.content}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}