import TweetFeed from "@/app/components/TweetFeed";

export default function Home() {
  return (
    // O layout principal já é gerenciado pelo RootLayout
    // Apenas renderizamos o componente cliente do feed.
    <TweetFeed />
  );
}