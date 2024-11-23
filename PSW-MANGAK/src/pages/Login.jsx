import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, TextField, Button, Paper } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0037', // Vermelho para botões
    },
    background: {
      default: '#000000', // Fundo da página
      paper: '#1E1E1E', // Fundo do formulário
    },
    text: {
      primary: '#FFFFFF', // Cor do texto
      secondary: '#CCCCCC', // Texto mais claro
    },
  },
  typography: {
    h5: {
      fontWeight: 700,
      fontSize: '1.8rem',
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      color: '#CCCCCC',
    },
  },
});

export default function LoginPage() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 10,
            borderTop: "3px solid #FF0037",
            borderRadius: '8px',
            bgcolor: '#2c2c2c',
            maxWidth: {xs: "244px",md: "344px", lg: "444px"},
            width: '100%',
            textAlign: 'center',
          }}
        >
          <TextField
            fullWidth
            label="Nome de usuário"
            variant="outlined"
            sx={{
              marginBottom: 3,
              '& .MuiInputBase-root': {
                bgcolor: '#1E1E1E',
                color: '#FFFFFF',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF0037',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF0037',
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{
              marginBottom: 3,
              '& .MuiInputBase-root': {
                bgcolor: '#1E1E1E',
                color: '#FFFFFF',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF0037',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF0037',
              },
            }}
          />
          <TextField
            fullWidth
            label="Senha"
            variant="outlined"
            type="password"
            sx={{
              marginBottom: 3,
              '& .MuiInputBase-root': {
                bgcolor: '#1E1E1E',
                color: '#FFFFFF',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF0037',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF0037',
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              marginTop: "16px",
              padding: '10px 0',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: '#CC002A',
              },
            }}
          >
            Cadastrar
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}