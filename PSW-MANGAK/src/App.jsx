import Actions from "./components/Actions";
import ArtGallery from "./components/ArtGallery";
import Content from "./components/Content";
import Description from "./components/Description";
import Header from "./components/Header";
import TagsSection from "./components/TagsSection";
import { Box } from "@mui/material";
import chainsawCover from "./assets/img/Chainsaw_Man_Cover_Volume_1.svg";
import img1 from "./assets/img/chainsaw1.jpg";
import img2 from './assets/img/chainsaw2.jpg';
import img3 from './assets/img/chainsaw3.jpeg';
import img4 from './assets/img/chainsaw4.webp';
import img5 from './assets/img/chainsaw5.jpg';
import img6 from './assets/img/chainsaw6.jpeg';
import img7 from './assets/img/chainsaw7.jpg';
import img8 from './assets/img/chainsaw8.webp';
import img9 from './assets/img/chainsaw9.webp';

function App() {
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
          bgcolor: "#000",
          padding: "16px",        
          color: "#fff",
        }}
      >

        <Header/>

        <Content
          mangaImage={chainsawCover}
          title="Chainsaw Man"
          author="Tatsuki Fujimoto"
          rating="9.30"
          reviews="10k"
          statusDot="•"
          publication="PUBLICATION: 2021, ONGOING"
        />

        <Actions />

        <Description
          text="Broke young man + chainsaw demon = Chainsaw Man! Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil-dog Pochita and becomes something new and dangerous—Chainsaw Man!"
        />

        {
          [
            {section: "Genres", tags: ["Action", "Adventure", "Fantasy"]},
            {section: "Demographic", tags: ["Shounen", "Seinen", "Josei"]},
            {section: "Buy", tags: ["Amazon", "Barnes & Noble", "Book Depository"]},
            {section: "Track", tags: ["MyAnimeList", "AniList", "Kitsu"]}
          ].map((data) => (
            <TagsSection key={data.section} data={data} />
          ))
        }
  
        <ArtGallery imageList={[
          img1.defaulr || img1,
          img2.default || img2,
          img3.default || img3,
          img4.default || img4,
          img5.default || img5,
          img6.default || img6,
          img7.default || img7,
          img8.default || img8,
          img9.default || img9,
        ]}/>
      
      </Box>
    </Box>
  );
}

export default App;