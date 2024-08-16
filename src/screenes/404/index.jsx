import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box, Button, Typography } from "@mui/material";
import { CheckExpired, NoLogin } from "../../custom/LoginProcess";
import { Link } from "react-router-dom";

const Page404 = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClick = () => {
    if(localStorage.getItem("role") == "quan-tri-vien"){
      window.location.href = "/dashboard";
    }
    else{
      window.location.href = "/seller";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h1" component="div" sx={{ mb: 2 , fontSize: "10em"}}>
        404
      </Typography>
      <Typography variant="h5" component="div" sx={{ mb: 4 , fontSize: "2em"}}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        component={Link}
        onClick={handleClick}
        variant="contained"
        color="success"
        sx={{ fontSize: "2rem"}}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default Page404;
