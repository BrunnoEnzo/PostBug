package com.brunnoenzo.backend.controller;

import com.brunnoenzo.backend.dto.AuthDTO;
import com.brunnoenzo.backend.dto.TokenResponseDTO;
import com.brunnoenzo.backend.dto.UserCreateDTO;
import com.brunnoenzo.backend.dto.UserResponseDTO;
import com.brunnoenzo.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserCreateDTO dto) {
        return ResponseEntity.status(201).body(authService.register(dto));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate a user and get a token")
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody AuthDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}