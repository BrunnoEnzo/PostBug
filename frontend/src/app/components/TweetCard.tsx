"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { TweetResponseDTO, UserResponseDTO } from '@/app/types/api';
import { useAuth } from '@/app/contexts/AuthContext';
import api from '@/app/services/api';


interface TweetCardProps {
  tweet: TweetResponseDTO;
  currentUser: UserResponseDTO | null;
  onDelete: (id: number) => void;
  onOpenComments: (id: number) => void;
  onOpenEdit: (tweet: TweetResponseDTO) => void;
  onFollowChange: (targetUserId: number, didFollow: boolean) => void;
}

export default function TweetCard({
  tweet,
  currentUser,
  onDelete,
  onOpenComments,
  onOpenEdit,
  onFollowChange,
}: TweetCardProps) {
  
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const initialIsFollowing = currentUser?.followingIds?.includes(tweet.authorId) || false;
  
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing); 
  
  const [followLoading, setFollowLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsFollowing(currentUser.followingIds.includes(tweet.authorId));
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, tweet.authorId]);

  const isOwner = isLoggedIn && currentUser?.userid === tweet.authorId;
  const isAdmin = isLoggedIn && currentUser?.role === 'ADMIN';


  const handleAuthClick = (action: () => void) => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      action();
    }
  };

  const handleFollow = async () => {
    handleAuthClick(async () => {
      setFollowLoading(true);
      try {
        await api.post(`/users/${tweet.authorId}/follow`);
        setIsFollowing(true);
        onFollowChange(tweet.authorId, true);
      } catch (err) {
        console.error("Falha ao seguir:", err);
      } finally {
        setFollowLoading(false);
      }
    });
  };

  const handleUnfollow = async () => {
    handleAuthClick(async () => {
      setFollowLoading(true);
      try {
        await api.post(`/users/${tweet.authorId}/unfollow`);
        setIsFollowing(false);
        onFollowChange(tweet.authorId, false);
      } catch (err) {
        console.error("Falha ao deixar de seguir:", err);
      } finally {
        setFollowLoading(false);
      }
    });
  };

  const handleDelete = async () => {
    if (!isOwner && !isAdmin) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/tweets/${tweet.id}`);
      onDelete(tweet.id);
    } catch (err) {
      console.error("Falha ao deletar:", err);
      setDeleteLoading(false); // <-- Permite tentar de novo se falhar
    }
  };
  
  const renderActionButtons = () => {
    
    // Caso 1: O usuário é o dono do tweet.
    // Pode editar e excluir. Não pode seguir a si mesmo.
    if (isOwner) {
      return (
        <Box>
          <IconButton
            size="small"
            onClick={() => onOpenEdit(tweet)}
            className="text-yellow-500"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-600"
          >
            {deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          </IconButton>
        </Box>
      );
    }

    // Caso 2: O usuário NÃO é o dono.
    // Precisamos renderizar os botões de Seguir E/OU Admin.
    
    const followButton = () => {
      // O usuário (logado ou não) está vendo o tweet de outra pessoa
      if (isFollowing) {
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={handleUnfollow}
            disabled={followLoading}
            startIcon={<PersonRemoveIcon />}
          >
            Seguindo
          </Button>
        );
      }
      return (
        <Button
          variant="contained"
          size="small"
          onClick={handleFollow}
          disabled={followLoading}
          startIcon={<PersonAddIcon />}
        >
          Seguir
        </Button>
      );
    };

    const adminDeleteButton = () => {
      // Se for admin E não for o dono, mostra o botão de excluir
      if (isAdmin && !isOwner) {
        return (
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-600"
            title="Excluir (Admin)"
          >
            {deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          </IconButton>
        );
      }
      return null;
    };

    // Retorna um contêiner flex com ambos os botões (se existirem)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {followButton()}
        {adminDeleteButton()}
      </Box>
    );
  };

  return (
    <Card 
      sx={{ mb: 2, bgcolor: 'grey.50' }}
      className="shadow-md"
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {tweet.authorScreenName.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={renderActionButtons()} 
        title={
          <Typography variant="h6" className="font-bold">
            @{tweet.authorScreenName}
          </Typography>
        }
        subheader={new Date(tweet.postTime).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body1" sx={{ wordBreak: 'break-word', fontSize: '1.1rem'}}>
          {tweet.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          onClick={() => handleAuthClick(() => onOpenComments(tweet.id))}
          startIcon={<ChatBubbleOutlineIcon />}
          color="primary"
        >
          Comentários
        </Button>
      </CardActions>
    </Card>
  );
}