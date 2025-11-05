"use client"; 

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext"; // <-- IMPORTAR

export default function Header() {
  const neonBlue = "rgba(59, 130, 246, 0.4)"; 
  
  // Use o contexto de autenticação
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Volta para a home após o logout
  };

  return (
    <AppBar
      position="static"
      elevation={0} 
      sx={{
        backgroundColor: "#ffffffff", 
        color: "rgba(59, 130, 246, 1)", 
        borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
        boxShadow: `0 2px 5px 0 ${neonBlue}`, 
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

        {/* Botão de Login/Logout à Direita */}
        <Box>
          {isLoggedIn ? (
            // Se estiver logado, mostra "Desconectar"
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
            >
              Desconectar
            </Button>
          ) : (
            // Se não, mostra "Login" que leva para a página /login
            <Button
              component={Link} // Usa o Link do Next.js
              href="/login"     // Define o destino
              variant="outlined"
              color="primary" 
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}