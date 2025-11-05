"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/app/services/api';
import { CommentResponseDTO, CommentCreateDTO } from '@/app/types/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  tweetId: number | null;
}

export default function CommentModal({ open, onClose, tweetId }: CommentModalProps) {
  const { isLoggedIn } = useAuth();
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  const fetchComments = async () => {
    if (!tweetId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CommentResponseDTO[]>(`/tweets/${tweetId}/comments`);
      // Ordena por data de postagem, mais recente primeiro
      const sortedComments = response.data.sort(
        (a, b) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()
      );
      setComments(sortedComments);
    } catch (err) {
      setError('Falha ao carregar comentários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && tweetId) {
      fetchComments();
    }
    // Reseta o estado ao fechar
    if (!open) {
      setComments([]);
      setNewComment('');
      setError(null);
    }
  }, [open, tweetId]);

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!tweetId || !newComment.trim()) return;

    setPostLoading(true);
    setError(null);

    const dto: CommentCreateDTO = { content: newComment };

    try {
      // O backend não suporta comentário em comentário, então usamos o endpoint do tweet
      await api.post(`/tweets/${tweetId}/comments`, dto);
      setNewComment('');
      // Recarrega os comentários para incluir o novo
      await fetchComments();
    } catch (err) {
      setError('Falha ao enviar comentário. Tente novamente.');
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Comentários
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        
        <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          {!loading && comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              Nenhum comentário ainda.
            </Typography>
          )}
          {comments.map((comment) => (
            <ListItem key={comment.id} alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography component="span" variant="subtitle2" className="font-bold">
                    @{comment.authorScreenName}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {comment.content}
                    </Typography>
                    <Typography component="span" variant="caption" display="block" color="text.secondary" className="mt-1">
                      {new Date(comment.postTime).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      {isLoggedIn && (
        <DialogActions sx={{ p: '16px 24px' }}>
          <Box component="form" onSubmit={handleSubmitComment} className="w-full">
            <TextField
              fullWidth
              variant="outlined"
              label="Adicionar um comentário..."
              multiline
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={postLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={postLoading || !newComment.trim()}
              className="mt-2" // Tailwind margin-top
            >
              {postLoading ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
}