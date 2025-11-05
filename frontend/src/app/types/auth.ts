// Baseado em Role.java
export type Role = "USER" | "ADMIN";

// Baseado em UserCreateDTO.java
export interface UserCreateDTO {
  screenName: string;
  password?: string; // Senha é obrigatória na criação, mas o DTO de update pode não ter
  profileImage?: string | null;
  bio?: string | null;
  role: Role;
}

// Baseado em AuthDTO.java
export interface AuthDTO {
  screenName: string;
  password?: string;
}

// Baseado em TokenResponseDTO.java
export interface TokenResponseDTO {
  token: string;
}