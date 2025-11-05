package com.brunnoenzo.backend.controller;

import com.brunnoenzo.backend.dto.UserResponseDTO;
import com.brunnoenzo.backend.dto.UserUpdateDTO;
import com.brunnoenzo.backend.service.TweetUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Endpoints for managing users and follows")

/**
 * (Controlador para gerenciamento de usuários.)
 */
public class TweetUserController {

    private final TweetUserService userService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Lista todos os usuários cadastrados (RF02)")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Consulta um usuário específico pelo ID (RF03)")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // --- Endpoints Autenticados ---

    @GetMapping("/me")
    @Operation(summary = "Get current user info", description = "Consulta as informações do usuário autenticado",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UserResponseDTO> getMe() {
        return ResponseEntity.ok(userService.getMe());
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user", description = "Atualiza as informações do usuário autenticado (RF04)",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UserResponseDTO> updateUser(@Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateUser(dto));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current user", description = "Exclui a conta do usuário autenticado (RF05)",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteUser() {
        userService.deleteUser();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/follow")
    @Operation(summary = "Follow a user", description = "Faz o usuário autenticado seguir outro usuário",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> followUser(@PathVariable Long id) {
        userService.followUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unfollow")
    @Operation(summary = "Unfollow a user", description = "Faz o usuário autenticado deixar de seguir outro usuário",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> unfollowUser(@PathVariable Long id) {
        userService.unfollowUser(id);
        return ResponseEntity.ok().build();
    }
}