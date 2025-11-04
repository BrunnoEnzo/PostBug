package com.brunnoenzo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new Comment.
 * (DTO para criar um novo Comentário.)
 */
public record CommentCreateDTO(
        @NotBlank(message = "Content is required")
        @Size(max = 280, message = "Content must be up to 280 characters")
        String content
) {}