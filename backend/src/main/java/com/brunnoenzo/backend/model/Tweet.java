package com.brunnoenzo.backend.model;

import jakarta.persistence.*;
// Importações de Lombok específicas
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString(exclude = {"tweetUser", "comments"})
@NoArgsConstructor
@AllArgsConstructor

/**
 * (Entidade representando um tweet postado por um usuário.)
 */
public class Tweet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private Instant postTime;

    @Column(nullable = false, length = 280)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private TweetUser tweetUser;

    @OneToMany(mappedBy = "tweet", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    // --- Métodos equals() e hashCode() manuais ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tweet tweet = (Tweet) o;
        return id != null && id.equals(tweet.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}