package com.brunnoenzo.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * (DTO para autenticação de usuários.)
 */
public record AuthDTO(
        @NotBlank String screenName,
        @NotBlank String password
) {}