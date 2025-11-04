package com.brunnoenzo.backend.config;

import com.brunnoenzo.backend.repository.TweetUserRepository;
import com.brunnoenzo.backend.service.TokenService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    // URLs públicas que não exigem autenticação
    private static final String[] PUBLIC_URLS = {
            "/api/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF (comum em APIs stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API não guarda estado (sessão)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_URLS).permitAll() // Permite acesso público
                        .requestMatchers(HttpMethod.GET, "/api/tweets/**").permitAll() // Todos podem ver tweets
                        .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll() // Todos podem ver usuários
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Rotas de admin
                        .anyRequest().authenticated() // Qualquer outra rota exige autenticação
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(
                        // Trata erros de autenticação (ex: token inválido)
                        (request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                ))
                // Adiciona nosso filtro JWT antes do filtro padrão do Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Provedor de serviço para buscar usuários (necessário para o Spring Security)
    @Bean
    public UserDetailsService userDetailsService(TweetUserRepository userRepository) {
        return screenName -> userRepository.findByScreenName(screenName)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + screenName));
    }

    // Define o
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Componente central para autenticação
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}