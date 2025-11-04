package com.brunnoenzo.backend.dto;

// DTO para resposta (sem senha)
public record UserResponseDTO(
        Long userid,
        String screenName,
        String profileImage,
        String bio,
        String role,
        int followingCount,
        int followersCount
) {}