// MangaViewer.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from "@mui/material";
import Header from "../components/Header";
import Content from "../components/Content";
import Actions from "../components/Actions";
import Description from "../components/Description";
import TagsSection from "../components/TagsSection";
import ArtGallery from "../components/ArtGallery";
import mangas from '../BD/mangasData';
import styles from './MangaViewer.module.css';

function MangaViewer() {
  const { id } = useParams();
  const manga = mangas.find(m => m.id === parseInt(id));

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
          maxWidth: 800,
          bgcolor: "#000",
          borderRadius: 2,
          padding: "16px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Header />
        <Content
          mangaImage={manga.image}
          title={manga.title}
          author={manga.author}
          rating="9.30"
          reviews="10k"
          statusDot="•"
          publication="PUBLICATION: 2021, ONGOING"
        />
        <Actions />
        <Description text={manga.description} />
        <TagsSection section="Demographic" tags={[manga.demographic]} />
        <TagsSection section="Buy" tags={["Official", "Official2"]} />
        <TagsSection section="Track" tags={manga.tags} />
        <ArtGallery />
      </Box>
    </Box>
  );
}

export default MangaViewer;
