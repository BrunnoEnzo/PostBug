package com.brunnoenzo.backend.dto;

import java.time.Instant;

/**
 * (DTO para enviar dados de Comentário nas respostas.)
 */
public record CommentResponseDTO(
        Long id,
        String content,
        Instant postTime,
        String authorScreenName,
        Long tweetId,
        Long parentCommentId 
) {}