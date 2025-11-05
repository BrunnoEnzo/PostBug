import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bem-vindo ao Post Bug
      </Typography>
      <Typography>
        Este é o feed principal. Em breve, os tweets aparecerão aqui!
      </Typography>
    </Container>
  );
}