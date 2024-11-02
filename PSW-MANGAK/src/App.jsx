import Actions from "./components/Actions";
import ArtGallery from "./components/ArtGallery";
import Content from "./components/Content";
import Description from "./components/Description";
import Header from "./components/Header";
import TagsSection from "./components/TagsSection";
import { Box } from "@mui/material";
import chainsawCover from "./assets/img/Chainsaw_Man_Cover_Volume_1.svg";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        padding: "16px",
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
          border: "1px solid #444",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
        }}
      >

        <Header image="src/assets/img/Chainsaw Man Cover Volume 1.svg"/>

        <Content
          mangaImage={chainsawCover}
          title="Chainsaw Man"
          author="Tatsuki Fujimoto"
          rating="9.30"
          reviews="10k"
        />

        <Actions 
          statusDot="•"
          publication="PUBLICATION: 2021, ONGOING"
        />

        <Description
          text="Broke young man + chainsaw demon = Chainsaw Man! Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil-dog Pochita and becomes something new and dangerous—Chainsaw Man!"
        />

        {["Demographic", "Buy", "Track"].map((section) => (
          <TagsSection key={section} section={section} tags={["Official", "Official2"]} />
        ))}

        <ArtGallery />
      </Box>
    </Box>
  );
}

export default App;