import {
  Box,
  Typography,
  useTheme,
  Button,
  Alert,
} from "@mui/material";
import * as React from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { CheckRoleInAdmin, NoLogin } from "../../custom/LoginProcess";
import { useEffect, useState } from "react";
import { CheckExpired } from "../../custom/LoginProcess";
import { myAxios } from "../../Services/axios";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Stack from '@mui/material/Stack';

const Panner = () => {
  CheckExpired();
  NoLogin();
  CheckRoleInAdmin();
  const [banner, setBanner] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleRefresh = () => {
    setFetchTrigger((prev) => !prev);
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  useEffect(() => {
    getBanner();
  }, [fetchTrigger]);

  const addNewBanner = () => {
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    myAxios
      .post("uploads", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((reponse) => {
        if (reponse.data != null) {
          myAxios
            .post(
              "banners",
              {
                images: reponse.data,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((reponse) => {
              setFiles(null)
              setResponse(reponse.data);
              setUploading(false);
              handleRefresh();
            });
        }
      })
      .catch((error) => {
        setResponse({ error: error.message });
        console.error("Error:", error);
      });
      handleRefresh();
  };

  const getBanner = () => {
    myAxios
      .get("banners", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setFiles(null)
        setIsLoading(false);
        setBanner(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteBanner = (code) => {
    setIsLoading(true);
    myAxios
      .post(
        "banners/delete",
        {
          images: [`${code}`],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {
        setFiles(null)
        setIsLoading(false);
        handleRefresh();
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <Box m="20px">
      <Header title="Banner" />
      <Stack direction="row" spacing={2}>
        <Button
          component="label"
          variant="contained"
          color="success"
          startIcon={<CloudUploadIcon />}
          m="10px"
        >
          Upload {files?.length != null ? files?.length : null  } file
          <VisuallyHiddenInput
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={addNewBanner}
          disabled={uploading}
          startIcon={<CloudUploadIcon />}
        >
          {uploading ? <LinearProgress color="success" /> : "Tải lên"}
        </Button>
        {response && (
          <Box sx={{ mt: 2 }}>
            {response.error ? (
              <Alert severity="error">{response.error}</Alert>
            ) : (
              <Alert severity="success" >Tệp đã được tải lên thành công!</Alert>
            )}
          </Box>
        )}
      </Stack>
      {isLoading ? <LinearProgress color="secondary" /> : null}
      <Box style={{ maxHeight: "70vh", overflow: "auto" }}>
      <ImageList
       sx={{ width: '100%', height: '100%' }}
       rowHeight={'auto'}
        cols={4}
        gap={30}
        loading={true}
      >
        {banner.map((item) => (
          <ImageListItem key={item.id}>
            <img
              src={
                `${item.name}`.includes("http")
                  ? item.name
                  : `http://localhost:5181/api/get/image/${item.name}`
              }
              loading="lazy"
            />
            <ImageListItemBar
              title={item.id}
              actionIcon={
                <Button
                  variant="contained"
                  onClick={() => deleteBanner(item.id)}
                  color="success"
                >
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
    </Box>
  );
};

export default Panner;

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
