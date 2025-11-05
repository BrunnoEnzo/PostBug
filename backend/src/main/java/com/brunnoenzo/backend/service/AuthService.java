package com.brunnoenzo.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.brunnoenzo.backend.dto.AuthDTO;
import com.brunnoenzo.backend.dto.TokenResponseDTO;
import com.brunnoenzo.backend.dto.UserCreateDTO;
import com.brunnoenzo.backend.dto.UserResponseDTO;
import com.brunnoenzo.backend.model.TweetUser;
import com.brunnoenzo.backend.repository.TweetUserRepository;

import lombok.RequiredArgsConstructor;
import java.util.Collections;

@Service
@RequiredArgsConstructor

/**
 * (Serviço responsável pela autenticação e registro de usuários.)
 */
public class AuthService {

    private final TweetUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new user.
     * (Registra um novo usuário.)
     * @param dto Data for user creation.
     * @return DTO of the created user.
     */
    public UserResponseDTO register(UserCreateDTO dto) {
        if (userRepository.findByScreenName(dto.screenName()).isPresent()) {
            throw new IllegalArgumentException("Screen name already in use");
        }

        TweetUser newUser = new TweetUser();
        newUser.setScreenName(dto.screenName());
        newUser.setPassword(passwordEncoder.encode(dto.password())); // Criptografa a senha
        newUser.setBio(dto.bio());
        newUser.setProfileImage(dto.profileImage());
        newUser.setRole(dto.role() != null ? dto.role() : com.brunnoenzo.backend.model.Role.USER);

        TweetUser savedUser = userRepository.save(newUser);
        
        return new UserResponseDTO(
                savedUser.getUserid(),
                savedUser.getScreenName(),
                savedUser.getProfileImage(),
                savedUser.getBio(),
                savedUser.getRole(),
                0, 
                0,
                Collections.emptySet()
        );
    }

    /**
     * Authenticates a user and returns a JWT.
     * (Autentica um usuário e retorna um JWT.)
     * @param dto Login data.
     * @return DTO containing the token.
     */
    public TokenResponseDTO login(AuthDTO dto) {
        // O AuthenticationManager usa o UserDetailsService e PasswordEncoder
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.screenName(),
                        dto.password()
                )
        );

        // Se autenticado, busca o usuário e gera o token
        TweetUser user = userRepository.findByScreenName(dto.screenName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenService.generateToken(user);
        return new TokenResponseDTO(token);
    }
}