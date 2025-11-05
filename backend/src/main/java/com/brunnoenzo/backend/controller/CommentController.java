package com.brunnoenzo.backend.controller;

import com.brunnoenzo.backend.dto.CommentCreateDTO;
import com.brunnoenzo.backend.dto.CommentResponseDTO;
import com.brunnoenzo.backend.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Endpoints for managing comments and replies")

/**
 * (Controlador para gerenciamento de comentários.)
 */
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/tweets/{tweetId}/comments")
    @Operation(summary = "Get comments for a tweet", description = "Lista todos os comentários de um tweet específico")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsForTweet(@PathVariable Long tweetId) {
        return ResponseEntity.ok(commentService.getCommentsForTweet(tweetId));
    }

    // --- Endpoints Autenticados ---

    @PostMapping("/tweets/{tweetId}/comments")
    @Operation(summary = "Post a comment on a tweet", description = "Cria um novo comentário em um tweet",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CommentResponseDTO> createCommentOnTweet(
            @PathVariable Long tweetId,
            @Valid @RequestBody CommentCreateDTO dto) {
        CommentResponseDTO newComment = commentService.createCommentOnTweet(tweetId, dto);
        return ResponseEntity.created(URI.create("/api/comments/" + newComment.id()))
                .body(newComment);
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Delete a comment", description = "Exclui um comentário",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}