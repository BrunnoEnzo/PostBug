"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "@/app/EmotionCache";

// Um tema básico escuro para combinar com o PostBug
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6", // Um azul similar ao neon
    },
    background: {
      default: "#0a0a0a",
      paper: "#171717",
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={darkTheme}>
        {/* CssBaseline normaliza o estilo e aplica a cor de fundo */}
        <CssBaseline />
        {children}
      </ThemeProvider>
</NextAppDirEmotionCacheProvider>
  );
}