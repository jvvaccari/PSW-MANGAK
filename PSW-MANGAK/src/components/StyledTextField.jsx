import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const StyledTextField = ({ label, value, onChange, type = "text", ...props }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      type={type}
      sx={{
        marginBottom: "16px",
        "& .MuiInputBase-root": {
          bgcolor: "#1E1E1E",
          color: "#FFFFFF",
        },
        "& .MuiOutlinedInput-root": {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FF0037",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FF0037",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#FFFFFF",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#FFFFFF",
        },
      }}
      {...props}
    />
  );
};

StyledTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default StyledTextField;
