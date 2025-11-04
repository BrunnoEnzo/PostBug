"use client"; // Adicionado na etapa anterior

import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  // O mesmo tom de azul neon do Header
  const neonBlue = "rgba(59, 130, 246, 0.4)";

  return (
    <Box
      component="footer"
      sx={{
        py: 3, // padding vertical
        px: 2, // padding horizontal
        mt: "auto", // Margem superior automática
        // Fundo escuro (como estava antes)
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[900],
        
        // Detalhe neon combinando com o Header
        borderTop: (theme) => `2px solid ${theme.palette.primary.main}`,
        boxShadow: `0 -2px 5px 0 ${neonBlue}`, // Brilho para cima
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {"Desenvolvido por Brunno Enzo Silva Meneses"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Disciplina: Sistemas Distribuídos | Professor: Ricardo De Andrade Kratz"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <MuiLink color="inherit" href="https://github.com/BrunnoEnzo" target="_blank" rel="noopener">
            github.com/BrunnoEnzo
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}