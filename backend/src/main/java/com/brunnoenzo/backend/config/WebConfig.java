package com.brunnoenzo.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration

/**
 * (Configuração para CORS na aplicação.)
 */
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica o CORS para todos os endpoints /api
                .allowedOrigins("*") // Permite requisições do seu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                .allowedHeaders("*")    // Permite todos os cabeçalhos
                .allowCredentials(true); // Permite o envio de credenciais (como tokens)
    }
}