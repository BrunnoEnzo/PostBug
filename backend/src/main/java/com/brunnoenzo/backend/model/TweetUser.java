package com.brunnoenzo.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
// Importações de Lombok específicas
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Objects; // Importar Objects para equals/hashCode

@Entity
// Substituir @Data por anotações específicas
@Getter
@Setter
@ToString(exclude = {"tweets", "comments", "following", "followers"}) // Exclui coleções do toString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tweet_user")
public class TweetUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;

    @Column(unique = true, nullable = false)
    @NotBlank
    private String screenName;

    @Column(nullable = false)
    @NotBlank
    @Size(min = 6)
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

    // Relacionamento: Lógica de "Seguindo"
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    private Set<TweetUser> following = new HashSet<>();

    @ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
    private Set<TweetUser> followers = new HashSet<>();

    // --- Métodos do UserDetails (Spring Security) ---
    // ... (métodos do UserDetails permanecem iguais) ...
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return this.screenName;
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

    // --- Métodos equals() e hashCode() manuais ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TweetUser tweetUser = (TweetUser) o;
        // Compara apenas pelo ID. Se for nulo, são diferentes.
        return userid != null && userid.equals(tweetUser.userid);
    }

    @Override
    public int hashCode() {
        // Usa apenas o ID para o hashCode
        return Objects.hash(userid);
    }
}