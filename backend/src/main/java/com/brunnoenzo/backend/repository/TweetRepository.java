package com.brunnoenzo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.brunnoenzo.backend.model.Tweet;

@Repository
public interface TweetRepository extends JpaRepository<Tweet, Long> {
}