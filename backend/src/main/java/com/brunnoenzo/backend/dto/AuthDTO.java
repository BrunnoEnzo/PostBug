package com.brunnoenzo.backend.dto;

import jakarta.validation.constraints.NotBlank;

// DTO para requisição de login
public record AuthDTO(
        @NotBlank String screenName,
        @NotBlank String password
) {}