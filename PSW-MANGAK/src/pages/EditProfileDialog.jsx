import React from 'react';
import { Box, Typography, TextField, IconButton, Dialog } from '@mui/material';
import { Close, ArrowForwardIos } from '@mui/icons-material';
import styles from '../components/styles';

function EditProfileDialog({ open, onClose }) {
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
          Dados de cadastro
        </Typography>
      </Box>

      {/* Input Fields */}
      <Box mx={2} mt={2}>
        <Typography variant="subtitle1" style={{ color: styles.textColor, fontSize: '12px', fontFamily: styles.bodyFont, marginBottom: 4 }}>
          Nome de usuário
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          placeholder="username"
          InputProps={{
            disableUnderline: true,
            style: {
              backgroundColor: styles.bgDataColor,
              color: styles.textColor,
              borderRadius: 4,
              height: 40, // Adjusted height to make it smaller
              padding: '0 12px', // Less padding for a more compact look
            },
          }}
          style={{ marginBottom: 12 }} // Reduced margin between fields
        />

        <Typography variant="subtitle1" style={{ color: styles.textColor, fontSize: '12px', fontFamily: styles.bodyFont, marginBottom: 4 }}>
          Email
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          placeholder="user@gmail.com"
          InputProps={{
            disableUnderline: true,
            style: {
              backgroundColor: styles.bgDataColor,
              color: styles.textColor,
              borderRadius: 4,
              height: 40, // Adjusted height
              padding: '0 12px',
            },
          }}
          style={{ marginBottom: 12 }}
        />

        <Typography variant="subtitle1" style={{ color: styles.textColor, fontSize: '12px', fontFamily: styles.bodyFont, marginBottom: 4 }}>
          Senha
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          placeholder="********"
          type="password"
          InputProps={{
            disableUnderline: true,
            style: {
              backgroundColor: styles.bgDataColor,
              color: styles.textColor,
              borderRadius: 4,
              height: 40, // Adjusted height
              padding: '0 12px',
            },
          }}
        />
      </Box>

      {/* Confirm Button */}
      <Box mx={2} mt={4}>
        <button
          style={{
            width: '100%',
            backgroundColor: styles.bgDataColor,
            color: styles.textColor,
            fontFamily: styles.bodyFont,
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Confirmar
          <ArrowForwardIos style={{ fontSize: '14px', color: styles.textColor }} />
        </button>
      </Box>
    </Dialog>
  );
}

export default EditProfileDialog;
