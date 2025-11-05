package com.brunnoenzo.backend.service;

import com.brunnoenzo.backend.dto.TweetCreateDTO;
import com.brunnoenzo.backend.dto.TweetResponseDTO;
import com.brunnoenzo.backend.dto.TweetUpdateDTO;
import com.brunnoenzo.backend.model.Tweet;
import com.brunnoenzo.backend.model.TweetUser;
import com.brunnoenzo.backend.repository.TweetRepository;
import com.brunnoenzo.backend.repository.TweetUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

/**
 * (Serviço responsável pelas operações relacionadas a tweets.)
 */
public class TweetService {

    private final TweetRepository tweetRepository;
    private final TweetUserRepository userRepository;

    private TweetUser getAuthenticatedUser() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(userIdStr);

        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found"));
    }

    private TweetResponseDTO mapToTweetResponseDTO(Tweet tweet) {
        return new TweetResponseDTO(
                tweet.getId(),
                tweet.getContent(),
                tweet.getPostTime(),
                tweet.getTweetUser().getScreenName(),
                tweet.getTweetUser().getUserid()
        );
    }

    @Transactional(readOnly = true)
    public List<TweetResponseDTO> getAllTweets() {
        return tweetRepository.findAll().stream()
                .map(this::mapToTweetResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TweetResponseDTO getTweetById(Long id) {
        Tweet tweet = tweetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tweet not found"));
        return mapToTweetResponseDTO(tweet);
    }

    @Transactional
    public TweetResponseDTO createTweet(TweetCreateDTO dto) {
        TweetUser user = getAuthenticatedUser();
        Tweet newTweet = new Tweet();
        newTweet.setContent(dto.content());
        newTweet.setTweetUser(user);
        // postTime é definido automaticamente pelo @CreationTimestamp

        Tweet savedTweet = tweetRepository.save(newTweet);
        return mapToTweetResponseDTO(savedTweet);
    }

    @Transactional
    public TweetResponseDTO updateTweet(Long id, TweetUpdateDTO dto) {
        TweetUser user = getAuthenticatedUser();
        Tweet tweet = tweetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tweet not found"));

        // Verifica se o usuário logado é o dono do tweet
        if (!tweet.getTweetUser().getUserid().equals(user.getUserid())) {
            throw new AccessDeniedException("You are not allowed to update this tweet");
        }

        tweet.setContent(dto.content());
        Tweet updatedTweet = tweetRepository.save(tweet);
        return mapToTweetResponseDTO(updatedTweet);
    }

    @Transactional
    public void deleteTweet(Long id) {
        TweetUser user = getAuthenticatedUser();
        Tweet tweet = tweetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tweet not found"));

        // Só permite deletar se for o dono do tweet OU se for ADMIN
        if (!tweet.getTweetUser().getUserid().equals(user.getUserid()) &&
            !user.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException("You are not allowed to delete this tweet");
        }

        tweetRepository.delete(tweet);
    }
}