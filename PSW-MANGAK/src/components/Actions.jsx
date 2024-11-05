import { Box } from "@mui/material";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import IosShareIcon from '@mui/icons-material/IosShare';
import styles from "./Actions.module.css"

const Actions = () => (
  <Box sx={{display: "flex",gap: "8px"}}>
    <button className= {styles.actionButton}>
      <BookmarkAddIcon className={styles.actionIcon}/>
    </button>
    <button className= {styles.actionButton}>
      <IosShareIcon className={styles.actionIcon}/>
    </button>
  </Box>
);

export default Actions;