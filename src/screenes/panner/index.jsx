import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import * as React from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { NoLogin } from "../../custom/LoginProcess";
import { useEffect, useState } from "react";
import { CheckExpired } from "../../custom/LoginProcess";
import { myAxios } from "../../Services/axios";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Panner = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [banner,setBanner] = useState([])
  const [file, setFile] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const handleRefresh = () => {
    setFetchTrigger(prev => !prev);
  };

  useEffect(() => {
    getBanner()
  }, [fetchTrigger]);

  const getBanner = () => {
    myAxios
      .get("banners", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        console.log(response.data)
        setBanner(response.data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteBanner = (code) =>{
    myAxios
      .get("banners/delete",{
        "images": [`${code}`]
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        handleRefresh()
      })
      .catch((error) => {
        console.error("Error:", error);
      });
   }
  return (
    <Box m="20px">
        <Box display="flex">
        <Header title="Banner"/>
      </Box>
      <Button
        size="small"
        variant="contained"
        color="success"
      >
        <Typography gutterBottom variant="h6" component="div">
          Thêm Banner
        </Typography>
      </Button>
      <ImageList sx={{ width: '100%', height: '75vh' }} cols={4} rowHeight={'auto'} gap={30}>
      {banner.map((item) => (
        <ImageListItem key={item.id}>
          <img
            src={`${item.name}`.includes("http") ? item.name :`http://localhost:5181/api/get/image/${item.name}`}
          />
          <ImageListItemBar
            title={item.id}
            actionIcon={
              <Button variant="contained" onClick={() => deleteBanner(item.id)} color="success">
              <Typography variant="h6" color="#fff">
                Xoá
              </Typography>
          </Button>
            }
          />
          
        </ImageListItem>
      ))}
    </ImageList>
    </Box>
  );
};

export default Panner;