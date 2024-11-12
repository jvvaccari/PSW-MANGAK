import React from 'react';
import { Box, Typography, Divider, IconButton, Dialog } from '@mui/material';
import { Close } from '@mui/icons-material';
import AccountButton from '../components/AccountButton';
import UserInfo from '../components/UserInfo';
import styles from '../components/styles';

function AccountDialog({ open, onClose }) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: styles.bgColor,
            color: styles.textColor,
            fontFamily: styles.bodyFont,
            width: '100%',
            maxWidth: 320, // Mobile width
            height: 568,    // Mobile height
            margin: 0,      // Align to top of the screen
          },
        }}
      >
        {/* Header */}
        <Box position="relative" p={1} textAlign="center">
          <IconButton
            onClick={onClose}
            style={{ position: 'absolute', right: 8, top: 8, color: styles.textColor }}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontFamily: styles.titleFont, fontSize: '18px' }}>
            Conta
          </Typography>
        </Box>
  
        {/* User Information */}
        <UserInfo username="Username" email="user@gmail.com" />
  
        <Divider style={{ backgroundColor: '#1E1E1E', margin: '12px 0' }} />
  
        {/* Action Buttons */}
        <Box my={1} mx={2}>
          <AccountButton label="Editar dados de cadastro" />
        </Box>
        <Box my={1} mx={2}>
          <AccountButton label="Excluir conta" />
        </Box>
  
        {/* Large Space and Logout Button */}
        <Box mt={8} mb={2} mx={2}>
          <AccountButton label="Sair da conta" className="logout-button" />
        </Box>
      </Dialog>
    );
  }
  
  export default function AccountPage() {
    const [open, setOpen] = React.useState(true);
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return <AccountDialog open={open} onClose={handleClose} />;
  }