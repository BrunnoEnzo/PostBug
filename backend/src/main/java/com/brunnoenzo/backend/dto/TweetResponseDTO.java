package com.brunnoenzo.backend.dto;

import java.time.Instant;

/**
 * DTO for sending Tweet data in responses.
 * (DTO para enviar dados de Tweet nas respostas.)
 */
public record TweetResponseDTO(
        Long id,
        String content,
        Instant postTime,
        String authorScreenName,
        Long authorId
) {}