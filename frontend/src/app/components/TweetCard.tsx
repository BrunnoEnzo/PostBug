"use client";

import React, { useState } from 'react';
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
}

export default function TweetCard({
  tweet,
  currentUser,
  onDelete,
  onOpenComments,
  onOpenEdit,
}: TweetCardProps) {
  
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const initialIsFollowing = currentUser?.followingIds?.includes(tweet.authorId) || false;

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing); 
  
  const [followLoading, setFollowLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = isLoggedIn && currentUser?.userid === tweet.authorId;

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
      } catch (err) {
        console.error("Falha ao deixar de seguir:", err);
      } finally {
        setFollowLoading(false);
      }
    });
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/tweets/${tweet.id}`);
      onDelete(tweet.id); // Avisa o pai para remover da lista
    } catch (err) {
      console.error("Falha ao deletar:", err);
      setDeleteLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (isOwner) {
      return (
        <Box>
          <IconButton
            size="small"
            onClick={() => onOpenEdit(tweet)}
            className="text-yellow-500" // Tailwind
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-600" // Tailwind
          >
            {deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          </IconButton>
        </Box>
      );
    }

    // Não mostra botão de seguir para si mesmo
    if (!isLoggedIn || (currentUser && currentUser.userid !== tweet.authorId)) {
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
    }
    return null;
  };

  return (
    <Card 
      sx={{ mb: 2, bgcolor: 'grey.50' }} // Fundo cinza claro
      className="shadow-md" // Tailwind shadow
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
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
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