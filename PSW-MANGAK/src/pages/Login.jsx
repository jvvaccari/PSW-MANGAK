// eslint-disable-next-line no-unused-vars
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";
import backgroundImage from "../assets/img/login-background.jpg"; // Import the background image

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF0037", // Red for buttons
    },
    background: {
      default: "#000000", // Fallback background color
      paper: "#1E1E1E", // Form background
    },
    text: {
      primary: "#FFFFFF", // Text color
      secondary: "#CCCCCC", // Light text color
    },
  },
  typography: {
    h5: {
      fontWeight: 700,
      fontSize: "1.8rem",
      color: "#FFFFFF",
    },
    body1: {
      fontSize: "1rem",
      color: "#CCCCCC",
    },
  },
});

export default function SignUpPage() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          padding: "0",
          backgroundImage: `url(${backgroundImage})`, // Add background image
          backgroundSize: "cover", // Ensure the image covers the entire area
          backgroundPosition: "center", // Center the image
          backgroundRepeat: "no-repeat", // Prevent image tiling
        }}
      >
        {/* Top Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "3% 5%",
            bgcolor: "transparent",
          }}
        >
          {/* Branding */}
          <Typography
            component="a"
            sx={{
              fontWeight: "bold",
              color: "#FF0037",
              fontSize: "6vw",
              textDecoration: "none",
              "@media (min-width: 600px)": {
                fontSize: "1.8rem",
              },
            }}
          >
            MANGAK
          </Typography>

          {/* Cadastrar Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontWeight: "bold",
              padding: "2% 5%",
              fontSize: "3.5vw",
              borderRadius: "6px",
              "&:hover": {
                bgcolor: "#CC002A",
              },
              "@media (min-width: 600px)": {
                padding: "6px 16px",
                fontSize: "0.875rem",
              },
            }}
          >
            Cadastrar
          </Button>
        </Box>

        {/* Login Form Centered */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5%",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "5%",
              borderRadius: "8px",
              bgcolor: "background.paper",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
              borderTop: "4px solid #FF0037",
              "@media (min-width: 768px)": {
                width: "50%",
                maxWidth: "500px",
              },
              "@media (min-width: 1024px)": {
                width: "40%",
                maxWidth: "600px",
              },
            }}
          >

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              sx={{
                marginBottom: "16px",
                "& .MuiInputBase-root": {
                  bgcolor: "#1E1E1E",
                  color: "#FFFFFF",
                },
                "& .MuiInputLabel-root": {
                  color: "#CCCCCC",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF0037",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF0037",
                },
              }}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              label="Senha"
              variant="outlined"
              type="password"
              sx={{
                marginBottom: "24px",
                "& .MuiInputBase-root": {
                  bgcolor: "#1E1E1E",
                  color: "#FFFFFF",
                },
                "& .MuiInputLabel-root": {
                  color: "#CCCCCC",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF0037",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF0037",
                },
              }}
            />

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                padding: "3%",
                fontWeight: "bold",
                fontSize: "4vw",
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#CC002A",
                },
                "@media (min-width: 600px)": {
                  padding: "10px 0",
                  fontSize: "1rem",
                },
              }}
            >
              Entrar
            </Button>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
