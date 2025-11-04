import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bem-vindo ao Post Bug
      </Typography>
      <Typography>
        Aqui ficará a tela de tweets.
      </Typography>
    </Container>
  );
}