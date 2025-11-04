package com.brunnoenzo.backend.service;

import com.brunnoenzo.backend.model.Role;
import com.brunnoenzo.backend.model.TweetUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class TokenService {

    @Autowired
    private JwtEncoder jwtEncoder;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Gera um novo token JWT para o usuário.
     * Esta é a única função deste serviço agora.
     */
    public String generateToken(TweetUser userDetails) {
        Instant now = Instant.now();

        // Coleta as "ROLES" e transforma em "SCOPES"
        // ex: "ROLE_ADMIN ROLE_USER"
        String scopes = userDetails.getAuthorities().stream()
                .map(authority -> "ROLE_" + authority.getAuthority())
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("postbug-api")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(jwtExpiration / 1000)) // Converte ms para segundos
                // O "subject" agora é o ID do usuário. ISSO É IMPORTANTE!
                .subject(userDetails.getUserid().toString())
                .claim("scope", scopes) // Usado para autorização (ex: hasAuthority('SCOPE_ROLE_ADMIN'))
                .claim("screenName", userDetails.getScreenName()) // Claim customizado se precisarmos
                .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}