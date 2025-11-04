package com.brunnoenzo.backend.dto;

import java.time.Instant;

/**
 * DTO for sending Comment data in responses.
 * (DTO para enviar dados de Comentário nas respostas.)
 */
public record CommentResponseDTO(
        Long id,
        String content,
        Instant postTime,
        String authorScreenName,
        Long tweetId,
        Long parentCommentId // Nulo se for um comentário raiz no tweet
) {}