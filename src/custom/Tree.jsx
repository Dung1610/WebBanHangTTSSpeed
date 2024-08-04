import {
  List,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  Typography,
  Box,
  Stack,
  TextField,
  Dialog,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Alert from '@mui/material/Alert';
import { myAxios } from "../Services/axios";
import { Link } from "react-router-dom";

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

const TreeNode = ({ node }) => {
  const [open, setOpen] = React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const handleOpenAdd = () => setOpenModalAdd(true);
  const handleCloseAdd = () => {
    setOpenModalAdd(false);
    setFile(null);
  };
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [file, setFile] = useState(null);

  const handleAdd = () => {
    handleClose();
    handleOpenAdd();
  };

  const [newCategory, setNewCategory] = React.useState("");
  const AddNewCategory = (code) => {
    console.log(newCategory)
    if (newCategory!=null){
      const res = myAxios.post("categories",{
        name: newCategory,
        parentCategoryCode: code,
        avatar: ""
      },{headers:
        {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }).catch((error) => {
        console.error("Error:", error);
      })
      if (res != null){
      handleCloseAdd();
      }
    }
    return
  };

  const handleClick = () => {
    setOpen(!open);
  };



  return (
    <>
      <ListItemButton sx={{ pl: (node.level + 1) * 4 }}>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary={node.name} />
        <Stack spacing={2} direction="row">
          <Link to={`/product/${node.code}`} variant="contained" color="success">
            <Typography variant="h6" color="#fff">
              Xem Chi Tiết
            </Typography>
          </Link>
          <Button onClick={handleOpenAdd} variant="contained" color="success">
            <Typography variant="h6" color="#fff">
              Thêm danh mục con
            </Typography>
          </Button>
          <Button onClick={handleOpen} variant="contained" color="success">
            <Typography variant="h6" color="#fff">
              Xem Chi Tiết
            </Typography>
          </Button>
        </Stack>
        {/* xem danh muc */}
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CardMedia
              sx={{ height: 200 }}
              image="https://flatsome.xyz/wp-content/uploads/2022/06/category.jpg"
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h1" component="div">
                Tên Danh Mục: {node.name}
              </Typography>
              <Typography variant="h4" color="text.secondary">
                id: {node.id}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="large" onClick={handleAdd} color="inherit">
                <Typography gutterBottom variant="h5" component="div">
                  Thêm Danh Mục Con
                </Typography>
              </Button>
              <Button size="large" onClick={handleClose} color="inherit">
                <Typography gutterBottom variant="h5" component="div">
                  Đóng
                </Typography>
              </Button>
            </CardActions>
          </Box>
        </Modal>
        {/* Them danh muc */}
        <Modal
          open={openModalAdd}
          onClose={handleCloseAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {file ? (
              <CardMedia
                sx={{ height: 200 }}
                image={URL.createObjectURL(file)}
                title="green iguana"
                component="label"
              >
                <VisuallyHiddenInput
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  type="file"
                />
              </CardMedia> // anh lay tu api
            ) : (
              <CardMedia
                sx={{ height: 200 }}
                image="https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg"
                title="green iguana"
                component="label"
              >
                <VisuallyHiddenInput
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  type="file"
                />
              </CardMedia>
            )}

            <CardContent
      sx={{
        '& .MuiTextField-root': { m: 1},
      }}
      noValidate
      autoComplete="off">
              <Typography variant="h1" textAlign={"center"} component="div">
                Tên Danh Mục:
              </Typography>
              <TextField
                id="fullWidth"
                variant="filled"
                size="medium"
                required
                fullWidth
                onChange={(e)=>setNewCategory(e.target.value)}
              />
              <Typography variant="h4" color="text.secondary">
                Tên Danh Mục Cha: {node.name}
              </Typography>
            </CardContent>
            {!newCategory ? <Alert variant="outlined" severity="error">
                Không Được Để Trống Tên Danh Mục
            </Alert> : ""}
            <CardActions>
              <Button size="large" onClick={()=>AddNewCategory(node.code)} color="inherit">
                <Typography gutterBottom variant="h5" component="div">
                  Thêm
                </Typography>
              </Button>
              <Button size="large" onClick={handleCloseAdd} color="inherit">
                <Typography gutterBottom variant="h5" component="div">
                  Đóng
                </Typography>
              </Button>
            </CardActions>
          </Box>
        </Modal>
        {open ? (
          <Button onClick={handleClick}>
            <ExpandMore />
          </Button>
        ) : (
          <Button onClick={handleClick}>
            <ExpandLess />
          </Button>
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {node.children && node.children.length > 0 && (
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </List>
        )}
      </Collapse>
    </>
  );
};

const Tree = ({ data }) => {
  return (
    <List style={{maxHeight: '77vh', overflow: 'auto'}}
      sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          CÂY DANH MỤC
        </ListSubheader>
      }
    >
      {data.map((rootNode) => (
        <TreeNode key={rootNode.id} node={rootNode}/>
      ))}
    </List>
  );
};

export default Tree;
