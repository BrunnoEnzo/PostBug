package com.brunnoenzo.backend.dto;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating user profile information.
 * (DTO para atualizar informações de perfil do usuário.)
 */
public record UserUpdateDTO(
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password, // Opcional: só atualiza se for fornecido

        String profileImage,
        String bio
) {}