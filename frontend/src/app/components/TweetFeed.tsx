"use client";

import React, { useState, useEffect } from 'react';
import { Container, Box, Button, CircularProgress, Alert, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { TweetResponseDTO, UserResponseDTO } from '@/app/types/api';
import TweetCard from './TweetCard';
import CreateTweetModal from './CreateTweetModal';
import CommentModal from './CommentModal';
import EditTweetModal from './EditTweetModal';

export default function TweetFeed() {
  const { isLoggedIn } = useAuth();
  
  const [tweets, setTweets] = useState<TweetResponseDTO[]>([]);
  const [currentUser, setCurrentUser] = useState<UserResponseDTO | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado dos Modais
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedTweetId, setSelectedTweetId] = useState<number | null>(null);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTweetToEdit, setSelectedTweetToEdit] = useState<TweetResponseDTO | null>(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Buscar Tweets (sempre)
      const tweetsRes = await api.get<TweetResponseDTO[]>('/tweets');
      // Ordena por data, mais recente primeiro
      const sortedTweets = tweetsRes.data.sort(
        (a, b) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()
      );
      setTweets(sortedTweets);

      // 2. Buscar usuário logado (se estiver logado)
      if (isLoggedIn) {
        const userRes = await api.get<UserResponseDTO>('/users/me');
        setCurrentUser(userRes.data);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Falha ao buscar dados:", err);
      setError('Não foi possível carregar o feed.');
    } finally {
      setLoading(false);
    }
  };

  // Busca dados no carregamento e quando o status de login muda
  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  const handleTweetPosted = () => {
    // Apenas busca os tweets novamente
    api.get<TweetResponseDTO[]>('/tweets')
      .then(res => {
        const sortedTweets = res.data.sort(
          (a, b) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()
        );
        setTweets(sortedTweets);
      })
      .catch(() => setError('Falha ao atualizar feed após postagem.'));
  };

  const handleDeleteTweet = (id: number) => {
    // Remove o tweet da lista localmente para UI imediata
    setTweets((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenComments = (id: number) => {
    setSelectedTweetId(id);
    setCommentModalOpen(true);
  };
  
  const handleOpenEditModal = (tweet: TweetResponseDTO) => {
    setSelectedTweetToEdit(tweet); // Guarda o tweet que será editado
    setEditModalOpen(true); // Abre o modal
  };

  const handleTweetUpdated = (updatedTweet: TweetResponseDTO) => {
    // Atualiza a lista de tweets no estado local para refletir a mudança
    setTweets((prev) =>
      prev.map((t) => (t.id === updatedTweet.id ? updatedTweet : t))
    );
  };

  // --- FUNÇÃO ADICIONADA ---
  /**
   * Atualiza o estado 'currentUser' localmente quando o usuário
   * segue ou deixa de seguir alguém, sem precisar de refresh.
   */
  const handleFollowStateChange = (targetUserId: number, didFollow: boolean) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;

      let newFollowingIds: number[];

      if (didFollow) {
        // Adiciona o ID se não estiver lá
        if (!prevUser.followingIds.includes(targetUserId)) {
          newFollowingIds = [...prevUser.followingIds, targetUserId];
        } else {
          newFollowingIds = prevUser.followingIds;
        }
      } else {
        // Remove o ID
        newFollowingIds = prevUser.followingIds.filter(id => id !== targetUserId);
      }
      
      // Retorna um novo objeto para o React atualizar o estado
      return {
        ...prevUser,
        followingIds: newFollowingIds
      };
    });
  };
  // --- FIM DA FUNÇÃO ---


  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Botão Criar Tweet */}
      {isLoggedIn && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            className="shadow-lg" // Tailwind
          >
            Criar novo Tweet
          </Button>
        </Box>
      )}

      {/* Estado de Carregamento */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Estado de Erro */}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

      {/* Feed */}
      {!loading && !error && tweets.length === 0 && (
         <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 5 }}>
           Nenhum tweet encontrado. Seja o primeiro a postar!
         </Typography>
      )}

      {!loading && tweets.length > 0 && (
        <Box>
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              currentUser={currentUser}
              onDelete={handleDeleteTweet}
              onOpenComments={handleOpenComments}
              onOpenEdit={handleOpenEditModal}
              onFollowChange={handleFollowStateChange} // <-- PROP ADICIONADA
            />
          ))}
        </Box>
      )}

      {/* Modais (só são renderizados, não exibidos) */}
      <CreateTweetModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTweetPosted={handleTweetPosted}
      />
      <CommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        tweetId={selectedTweetId}
      />
      <EditTweetModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tweetToEdit={selectedTweetToEdit}
        onTweetUpdated={handleTweetUpdated}
      />
    </Container>
  );
}