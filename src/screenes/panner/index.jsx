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
import LinearProgress from '@mui/material/LinearProgress';

const Panner = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [banner,setBanner] = useState([])
  const [file, setFile] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false)
        console.log(response.data)
        setBanner(response.data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteBanner = (code) =>{
    setIsLoading(true)
    myAxios
      .post("banners/delete",{
        images: [`${code}`]
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setIsLoading(false)
        handleRefresh()
      })
      .catch((error) => {
        setIsLoading(false)
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
      {isLoading ? <LinearProgress color="secondary" /> : null}
      <ImageList sx={{ width: '100%', height: '100%' }} cols={4} rowHeight={'auto'} gap={30} loading={true}>
      {banner.map((item) => (
        <ImageListItem key={item.id}>
          <img
            src={`${item.name}`.includes("http") ? item.name :`http://localhost:5181/api/get/image/${item.name}`}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.id}
            actionIcon={
              <Button variant="contained" onClick={() => deleteBanner(item.id)} color="success">
              <Typography variant="h4" color="#fff">
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