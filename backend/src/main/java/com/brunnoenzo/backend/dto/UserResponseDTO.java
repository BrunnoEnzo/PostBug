package com.brunnoenzo.backend.dto;

import com.brunnoenzo.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor

/**
 * (DTO para enviar dados de Usuário nas respostas.)
 */
public class UserResponseDTO {
    private Long userid;
    private String screenName;
    private String profileImage;
    private String bio;
    private Role role;
    private int followingCount;
    private int followersCount;
    private Set<Long> followingIds;
}