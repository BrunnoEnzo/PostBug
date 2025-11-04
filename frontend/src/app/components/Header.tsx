"use client"; // Necessário para componentes MUI interativos e Link

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link"; // Link do Next.js para navegação

export default function Header() {
  // O tom de azul neon, baseado no seu theme (#3b82f6)
  const neonBlue = "rgba(59, 130, 246, 0.4)"; 

  return (
    <AppBar
      position="static"
      elevation={0} // Remove a elevação padrão para o brilho se destacar
      sx={{
        backgroundColor: "#ffffffff", // Fundo branco obrigatório
        color: "rgba(59, 130, 246, 1)", // Cor do texto escura (preto)
        borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
        boxShadow: `0 2px 5px 0 ${neonBlue}`, // Efeito de brilho neon
      }}
    >
      <Toolbar>
        {/* Título à Esquerda */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
            Post Bug
          </Link>
        </Typography>

        {/* Botão de Login à Direita (agora com a cor primária) */}
        <Box>
          <Button
            variant="outlined"
            color="primary" // Usa a cor primária (azul) para borda e texto
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}