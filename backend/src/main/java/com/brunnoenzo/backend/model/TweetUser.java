package com.brunnoenzo.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data // Anotação do Lombok (gera Getters, Setters, equals, hashCode, toString)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tweet_user") // Nome da tabela
public class TweetUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;

    @Column(unique = true, nullable = false)
    @NotBlank
    private String screenName; // username

    @Column(nullable = false)
    @NotBlank
    @Size(min = 6) // Validação de senha
    private String password;

    private String profileImage;
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Relacionamento: Usuário tem muitos Tweets
    @OneToMany(mappedBy = "tweetUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Tweet> tweets = new HashSet<>();

    // Relacionamento: Usuário tem muitos Comentários
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    // Relacionamento: Lógica de "Seguindo" (Muitos-para-Muitos com ele mesmo)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"), // O dono do relacionamento (quem segue)
            inverseJoinColumns = @JoinColumn(name = "following_id") // Quem está sendo seguido
    )
    private Set<TweetUser> following = new HashSet<>(); // Quem eu sigo

    @ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
    private Set<TweetUser> followers = new HashSet<>(); // Quem me segue

    // --- Métodos do UserDetails (Spring Security) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Define a "ROLE_" prefixo que o Spring Security espera
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return this.screenName; // Usamos screenName como username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}