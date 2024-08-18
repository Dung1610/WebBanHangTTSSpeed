import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box, Button, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import BackIcon from "@mui/icons-material/DoorBackOutlined";

const SelectRegister = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        position="fixed"
        width="100%"
        textAlign="center"
        top="30%"
        alignItems="center"
      >
        <Typography variant="h1" marginBottom="20px">
          Choose Register
        </Typography>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          sx={{
            width: "30%",
            backgroundColor: "red",
            padding: "10px",
            marginBottom: "20px",
          }}
          onClick={() => {
            window.location.href = "/register";
          }}
        >
          Register by email
        </Button>
        <Button
          variant="contained"
          startIcon={<PhoneIcon />}
          sx={{
            width: "30%",
            backgroundColor: "green",
            padding: "10px",
            marginBottom: "20px",
          }}
          onClick={() => {
            window.location.href = "/registerPhone";
          }}
        >
          Register by phone
        </Button>
        <Button
          variant="contained"
          startIcon={<BackIcon />}
          sx={{
            width: "30%",
            backgroundColor: "blue",
            padding: "10px",
          }}
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Về trang đăng nhập
        </Button>
      </Box>
    </>
  );
};

export default SelectRegister;
