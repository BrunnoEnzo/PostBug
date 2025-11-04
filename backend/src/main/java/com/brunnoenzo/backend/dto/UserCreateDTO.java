package com.brunnoenzo.backend.dto;

import com.brunnoenzo.backend.model.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// DTO para criação de usuário
public record UserCreateDTO(
        @NotBlank(message = "Screen name is required")
        String screenName,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password,

        String profileImage,
        String bio,

        @NotNull(message = "Role is required")
        Role role
) {}