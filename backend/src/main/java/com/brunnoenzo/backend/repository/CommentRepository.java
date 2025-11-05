package com.brunnoenzo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.brunnoenzo.backend.model.Comment;

@Repository

/**
 * (Repositório para a entidade Comment.)
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {
}