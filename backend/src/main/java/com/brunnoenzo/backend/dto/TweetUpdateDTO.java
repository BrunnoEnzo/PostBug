package com.brunnoenzo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * (DTO para atualizar um Tweet existente.)
 */
public record TweetUpdateDTO(
        @NotBlank(message = "Content is required")
        @Size(max = 280, message = "Content must be up to 280 characters")
        String content
) {}