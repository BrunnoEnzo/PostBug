package com.brunnoenzo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.brunnoenzo.backend.model.TweetUser;

@Repository
public interface TweetUserRepository extends JpaRepository<TweetUser, Long> {
    // Método para o Spring Security encontrar o usuário pelo nome
    Optional<TweetUser> findByScreenName(String screenName);
}