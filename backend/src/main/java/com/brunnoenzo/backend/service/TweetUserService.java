package com.brunnoenzo.backend.service;

import java.util.List;
import java.util.Set; // <-- IMPORTAR
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brunnoenzo.backend.dto.UserResponseDTO;
import com.brunnoenzo.backend.dto.UserUpdateDTO;
import com.brunnoenzo.backend.model.TweetUser;
import com.brunnoenzo.backend.repository.TweetUserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TweetUserService {

    private final TweetUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retrieves the currently authenticated user.
     * (Recupera o usuário atualmente autenticado.)
     */
    private TweetUser getAuthenticatedUser() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(userIdStr);

        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found"));
    }

    /**
     * Converts a TweetUser entity to a UserResponseDTO.
     * (Converte uma entidade TweetUser para UserResponseDTO.)
     */
    private UserResponseDTO mapToUserResponseDTO(TweetUser user) {
        
        // --- MUDANÇA PRINCIPAL AQUI ---
        // Mapeia a lista de usuários seguidos para uma lista de IDs
        Set<Long> followingIds = user.getFollowing().stream()
                .map(TweetUser::getUserid)
                .collect(Collectors.toSet());
        // --- FIM DA MUDANÇA ---

        return new UserResponseDTO(
                user.getUserid(),
                user.getScreenName(),
                user.getProfileImage(),
                user.getBio(),
                user.getRole().name(),
                user.getFollowing().size(),
                user.getFollowers().size(),
                followingIds // Passa a lista de IDs para o DTO
        );
    }

    // Esta anotação é VITAL para que o .getFollowing() funcione
    @Transactional(readOnly = true) 
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponseDTO) // Agora chama o método corrigido
                .collect(Collectors.toList());
    }

    // Esta anotação é VITAL para que o .getFollowing() funcione
    @Transactional(readOnly = true) 
    public UserResponseDTO getUserById(Long id) {
        TweetUser user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return mapToUserResponseDTO(user); // Agora chama o método corrigido
    }

    // Esta anotação é VITAL para que o .getFollowing() funcione
    @Transactional(readOnly = true) 
    public UserResponseDTO getMe() {
        TweetUser user = getAuthenticatedUser();
        return mapToUserResponseDTO(user); // Agora chama o método corrigido
    }

    @Transactional
    public UserResponseDTO updateUser(UserUpdateDTO dto) {
        TweetUser user = getAuthenticatedUser();

        if (dto.password() != null && !dto.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.password()));
        }
        if (dto.profileImage() != null) {
            user.setProfileImage(dto.profileImage());
        }
        if (dto.bio() != null) {
            user.setBio(dto.bio());
        }

        TweetUser updatedUser = userRepository.save(user);
        // A transação @Transactional garante que .getFollowing() pode ser lido aqui
        return mapToUserResponseDTO(updatedUser); 
    }

    @Transactional
    public void deleteUser() {
        TweetUser user = getAuthenticatedUser();
        // A lógica de cascata no banco de dados deve cuidar de tweets e comentários
        userRepository.delete(user);
    }

    @Transactional
    public void followUser(Long userIdToFollow) {
        TweetUser currentUser = getAuthenticatedUser();
        TweetUser userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new EntityNotFoundException("User to follow not found"));

        if (currentUser.getUserid().equals(userIdToFollow)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        currentUser.getFollowing().add(userToFollow);
        userRepository.save(currentUser);
    }

    @Transactional
    public void unfollowUser(Long userIdToUnfollow) {
        TweetUser currentUser = getAuthenticatedUser();
        TweetUser userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new EntityNotFoundException("User to unfollow not found"));

        currentUser.getFollowing().remove(userToUnfollow);
        userRepository.save(currentUser);
    }

    // O MÉTODO DUPLICADO getUserById() FOI REMOVIDO
}