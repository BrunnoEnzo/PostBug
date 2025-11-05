// Baseado nos DTOs do backend

/**
 * Baseado em UserResponseDTO.java
 */
export interface UserResponseDTO {
  userid: number;
  screenName: string;
  profileImage: string | null;
  bio: string | null;
  role: string;
  followingCount: number;
  followersCount: number;
  // NOTA: O backend DTO não envia a lista de quem o usuário segue,
  // o que limita a capacidade de exibir "Seguindo" no carregamento.
}

/**
 * Baseado em TweetResponseDTO.java
 */
export interface TweetResponseDTO {
  id: number;
  content: string;
  postTime: string; // O Instant é serializado como string (ISO 8601)
  authorScreenName: string;
  authorId: number;
}

/**
 * Baseado em CommentResponseDTO.java
 */
export interface CommentResponseDTO {
  id: number;
  content: string;
  postTime: string; // O Instant é serializado como string
  authorScreenName: string;
  tweetId: number;
  parentCommentId: number | null;
}

/**
 * Baseado em CommentCreateDTO.java
 */
export interface CommentCreateDTO {
  content: string;
}

/**
 * Baseado em TweetCreateDTO.java
 */
export interface TweetCreateDTO {
  content: string;
}

/**
 * Baseado em TweetUpdateDTO.java
 */
export interface TweetUpdateDTO {
  content: string;
}