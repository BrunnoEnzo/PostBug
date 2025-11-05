"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "@/app/EmotionCache";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6", 
    },
    background: {
      default: "#ffffff", // Fundo padrão branco
      paper: "#f5f5f5",   // Fundo de "cartões" levemente cinza
    },
    text: {
      primary: "#171717" // Cor do texto primário (preto)
    }
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
</NextAppDirEmotionCacheProvider>
  );
}