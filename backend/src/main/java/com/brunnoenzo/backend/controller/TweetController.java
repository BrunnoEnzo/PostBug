package com.brunnoenzo.backend.controller;

import com.brunnoenzo.backend.dto.TweetCreateDTO;
import com.brunnoenzo.backend.dto.TweetResponseDTO;
import com.brunnoenzo.backend.dto.TweetUpdateDTO;
import com.brunnoenzo.backend.service.TweetService;
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
@RequestMapping("/api/tweets")
@RequiredArgsConstructor
@Tag(name = "Tweets", description = "Endpoints for managing tweets")
public class TweetController {

    private final TweetService tweetService;

    @GetMapping
    @Operation(summary = "Get all tweets", description = "Lista todos os tweets postados (RF07)")
    public ResponseEntity<List<TweetResponseDTO>> getAllTweets() {
        return ResponseEntity.ok(tweetService.getAllTweets());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tweet by ID", description = "Consulta um tweet específico pelo ID (RF08)")
    public ResponseEntity<TweetResponseDTO> getTweetById(@PathVariable Long id) {
        return ResponseEntity.ok(tweetService.getTweetById(id));
    }

    // --- Endpoints Autenticados ---

    @PostMapping
    @Operation(summary = "Create a new tweet", description = "Cria um novo tweet (RF06)",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TweetResponseDTO> createTweet(@Valid @RequestBody TweetCreateDTO dto) {
        TweetResponseDTO newTweet = tweetService.createTweet(dto);
        // Retorna 201 Created com a localização do novo recurso
        return ResponseEntity.created(URI.create("/api/tweets/" + newTweet.id()))
                .body(newTweet);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a tweet", description = "Atualiza o conteúdo de um tweet existente (RF09)",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TweetResponseDTO> updateTweet(@PathVariable Long id, @Valid @RequestBody TweetUpdateDTO dto) {
        return ResponseEntity.ok(tweetService.updateTweet(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tweet", description = "Exclui um tweet (RF10)",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteTweet(@PathVariable Long id) {
        tweetService.deleteTweet(id);
        return ResponseEntity.noContent().build();
    }
}