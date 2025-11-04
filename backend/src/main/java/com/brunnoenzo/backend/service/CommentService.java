package com.brunnoenzo.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brunnoenzo.backend.dto.CommentCreateDTO;
import com.brunnoenzo.backend.dto.CommentResponseDTO;
import com.brunnoenzo.backend.model.Comment;
import com.brunnoenzo.backend.model.Tweet;
import com.brunnoenzo.backend.model.TweetUser;
import com.brunnoenzo.backend.repository.CommentRepository;
import com.brunnoenzo.backend.repository.TweetRepository;
import com.brunnoenzo.backend.repository.TweetUserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TweetRepository tweetRepository;
    private final TweetUserRepository userRepository;

    private TweetUser getAuthenticatedUser() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(userIdStr);

        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found"));
    }

    private CommentResponseDTO mapToCommentResponseDTO(Comment comment) {
        return new CommentResponseDTO(
                comment.getId(),
                comment.getContent(),
                comment.getPostTime(),
                comment.getAuthor().getScreenName(),
                comment.getTweet().getId(),
                comment.getParentComment() != null ? comment.getParentComment().getId() : null
        );
    }

    @Transactional
    public CommentResponseDTO createCommentOnTweet(Long tweetId, CommentCreateDTO dto) {
        TweetUser user = getAuthenticatedUser();
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new EntityNotFoundException("Tweet not found"));

        Comment newComment = new Comment();
        newComment.setContent(dto.content());
        newComment.setAuthor(user);
        newComment.setTweet(tweet);
        newComment.setParentComment(null); // É um comentário raiz

        Comment savedComment = commentRepository.save(newComment);
        return mapToCommentResponseDTO(savedComment);
    }

    @Transactional
    public CommentResponseDTO replyToComment(Long parentCommentId, CommentCreateDTO dto) {
        TweetUser user = getAuthenticatedUser();
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new EntityNotFoundException("Parent comment not found"));

        Comment newReply = new Comment();
        newReply.setContent(dto.content());
        newReply.setAuthor(user);
        newReply.setTweet(parentComment.getTweet()); // Associa à mesma thread de tweet
        newReply.setParentComment(parentComment);

        Comment savedReply = commentRepository.save(newReply);
        return mapToCommentResponseDTO(savedReply);
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getCommentsForTweet(Long tweetId) {
        if (!tweetRepository.existsById(tweetId)) {
            throw new EntityNotFoundException("Tweet not found");
        }
        
        return commentRepository.findAll().stream()
                .filter(comment -> comment.getTweet().getId().equals(tweetId))
                .map(this::mapToCommentResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long id) {
        TweetUser user = getAuthenticatedUser();
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // Só permite deletar se for o dono do comentário OU se for ADMIN
        if (!comment.getAuthor().getUserid().equals(user.getUserid()) &&
            !user.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }
}