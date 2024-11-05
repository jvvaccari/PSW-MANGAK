import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from "@mui/material";
import Header from "../components/Header";
import Content from "../components/Content";
import Actions from "../components/Actions";
import Description from "../components/Description";
import TagsSection from "../components/TagsSection";
import ArtGallery from "../components/ArtGallery";
import mangas from '../BD/mangasData'; // Assumindo que seu banco de dados fictício está aqui

function MainPage() {
  const { id } = useParams(); // Pegamos o ID da URL
  const manga = mangas.find(m => m.id === parseInt(id)); // Encontramos o mangá correspondente

  // Se o ID do mangá não for encontrado, retornamos uma mensagem de erro
  if (!manga) {
    return <p style={{ color: "white", textAlign: "center", padding: "20px" }}>Mangá não encontrado</p>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "#000",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 320,
          bgcolor: "#000",
          borderRadius: 2,
          padding: "16px",
          color: "#fff",
        }}
      >
        <Header />
        <Content
          mangaImage={manga.image} // Usamos a imagem do mangá selecionado
          title={manga.title} // Título dinâmico
          author={manga.author} // Autor do mangá
          rating="9.30" // Exemplo estático (caso precise, pode ser adicionado ao BD)
          reviews="10k" // Exemplo estático
          statusDot="•" // Exemplo estático, poderia ser dinâmico se precisar
          publication="PUBLICATION: 2021, ONGOING" // Exemplo estático, poderia ser dinâmico
        />
        <Actions />
        <Description
          text={manga.description} // Descrição do mangá
        />
        <TagsSection 
          section="Demographic" 
          tags={[manga.demographic]} // Usando a demografia como tag
        />
        <TagsSection 
          section="Buy" 
          tags={["Official", "Official2"]} // Exemplo estático, pode adicionar dados adicionais se necessário
        />
        <TagsSection 
          section="Track" 
          tags={manga.tags} // Tags do mangá
        />
        <ArtGallery />
      </Box>
    </Box>
  );
}

export default MainPage;
