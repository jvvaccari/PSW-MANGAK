import { Box, IconButton } from "@mui/material";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import IosShareIcon from '@mui/icons-material/IosShare';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import styles from "./Actions.module.css"

const Actions = () => (
  <Box>
    <IconButton color="inherit" sx={{padding: "0px",gap: "8px"}}>
      <BookmarkAddIcon className={styles.actionButton}/>
      <IosShareIcon className={styles.actionButton}/>
      <ThumbUpOffAltIcon className={styles.actionButton}/>
    </IconButton>
  </Box>
);

export default Actions;