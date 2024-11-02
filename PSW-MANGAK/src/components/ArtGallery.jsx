// ArtGallery.jsx
import { Box, Typography, Avatar, Grid } from "@mui/material";
import chainsawCover from "/src/assets/img/Chainsaw_Man_Cover_Volume_1.svg";

const sampleImages = new Array(9).fill(chainsawCover);

const ArtGallery = () => (
  <Box sx={{ py: 2, border: "1px solid #444", borderRadius: 1, mt: 2 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, fontSize: "1em" }}>
      Art
    </Typography>
    <Grid container spacing={1}>
      {sampleImages.map((image, index) => (
        <Grid item xs={4} key={index}>
          <Avatar
            src={image}
            variant="rounded"
            sx={{ width: "100%", height: "auto", borderRadius: 1, border: "1px solid #444" }}
            alt={`Art ${index + 1}`}
          />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ArtGallery;