"use client"; // Necessário para componentes MUI interativos e Link

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link"; // Link do Next.js para navegação

export default function Header() {
  return (
    <AppBar position="static" color="default" elevation={1}>
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

        {/* Botão de Login à Direita */}
        <Box>
          <Button
            variant="outlined"
            color="inherit" // Um botão cinza/neutro simples como solicitado
            sx={{
              borderColor: "grey.700",
              "&:hover": {
                borderColor: "grey.500",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}