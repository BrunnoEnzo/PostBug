import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // padding vertical
        px: 2, // padding horizontal
        mt: "auto", // Margem superior automática para "grudar" no final
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[900], // Cor de fundo
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