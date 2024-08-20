import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { myAxios } from "../../Services/axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import Badge from "@mui/material/Badge";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ReloadIcon from "@mui/icons-material/ReplayOutlined";
import Popover from "@mui/material/Popover";
import { DataGrid } from "@mui/x-data-grid";
import {
  CheckExpired,
  CheckRoleInSeller,
  NoLogin,
} from "../../custom/LoginProcess";
import { Link } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function convertTimeString(timeString) {
  const [date, time, period] = timeString.split(" ");
  const [day, month, year] = date.split("/");
  const [hours, minutes, seconds] = time.split(":");

  let hour24 = parseInt(hours, 10);
  if (period === "CH" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "SA" && hour24 === 12) {
    hour24 = 0;
  }

  const dateTime = new Date(year, month - 1, day, hour24, minutes, seconds);

  return dateTime.toLocaleTimeString();
}

const Seller = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  CheckExpired();
  NoLogin();
  CheckRoleInSeller();
  const [open, setOpen] = useState(false);
  const [openM, setOpenM] = useState(false);

  const [ws, setWs] = useState(false);
  const handleOpen = () => {
    getCategory();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setProduct({
      name: "",
      description: "",
      shippingUnit: "",
      price: 0,
      saleOff: 0,
      auth: "",
      categoryCode: "",
      classiFies: [
        {
          groupName: "",
          name: "",
          image: null,
          quantity: 0,
          increasePercent: 0,
        },
      ],
      images: [],
    });
  };
  const [listMessage, setListMessage] = useState([]);
  const [message, setMessage] = useState([]);
  const [reply, setReply] = useState("");
  const [code, setCode] = useState(0);
  const [sender, setSender] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    shippingUnit: "Chưa Có",
    price: 0,
    saleOff: 0,
    auth: localStorage.getItem("user"),
    categoryCode: "",
    classiFies: [
      { groupName: "", name: "", image: null, quantity: 0, increasePercent: 0 },
    ],
    images: [],
  });
  const [anchor, setAnchor] = useState(null);
  const [productBySell, setProductBySell] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const handleRefresh = () => {
    setFetchTrigger((prev) => !prev);
  };

  // lay danh sach san pham theo nguoi ban
  const openPopover = (event) => {
    setAnchor(event.currentTarget);
  };
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: false,
    },
    {
      field: "description",
      headerName: "Miêu Tả",
      sortable: false,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 1,
    },
    {
      field: "priceSaleOff",
      headerName: "Giảm Giá ",
      flex: 1,
    },
    {
      field: "quantitySelled",
      headerName: "Số Lượng Đã Bán",
      flex: 1,
    },
    {
      field: "likes",
      headerName: "Lượt Thích",
      flex: 1,
    },
    {
      field: "classifies",
      headerName: "Phân Loại",
      sortable: false,
      flex: 3,
      renderCell: ({ row: { classifies } }) => {
        return (
          <Box display="flex" flexDirection="row">
            {classifies.map((i) => (
              <Box>
                <ListItemAvatar>
                  <Avatar src={i.image} />
                </ListItemAvatar>
                <ListItemText primary={i.name} secondary={i.quantity} />
              </Box>
            ))}
          </Box>
        );
      },
    },
  ];

  // Nhan tin
  const handleSelectMessage = (code, sender, index) => {
    setCode(code);
    setSelectedChat(index);
    myAxios
      .get(`messages/get/${code}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setSender(sender);

    const socket = new WebSocket(`ws://192.168.1.13:8000/ws/chat/${code}`);
    socket.onopen = function () {
      console.log("WebSocket connection established");
      setWs(socket);
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data).data;
      setMessage(data);
    };

    socket.onclose = function () {
      console.log("WebSocket connection closed");
      setWs(null);
    };
  };

  const getMess = () => {
    myAxios
      .get("boxchats/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setListMessage(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getSanPhamNguoiBan();
  }, [fetchTrigger]);
  const getSanPhamNguoiBan = () => {
    myAxios
      .post("products/shop", "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setProductBySell(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getCategory = () => {
    myAxios
      .get("categories/true", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // thêm sản phẩm
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleClassiFiesChange = (index, field, value) => {
    const newClassiFies = [...product.classiFies];
    newClassiFies[index][field] = value;
    setProduct({ ...product, classiFies: newClassiFies });
  };

  const handleClassiFiesImageChange = (index, event) => {
    const newClassiFies = [...product.classiFies];
    const formData = new FormData();
    formData.append("files", event.target.files[0]);
    myAxios
      .post("uploads", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((reponse) => {
        newClassiFies[index].image = reponse.data[0];
        setProduct({ ...product, classiFies: newClassiFies });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addClassiFie = () => {
    setProduct({
      ...product,
      classiFies: [
        ...product.classiFies,
        {
          groupName: "",
          name: "",
          image: null,
          quantity: 0,
          increasePercent: 0,
        },
      ],
    });
  };

  const removeClassiFie = (index) => {
    setProduct({
      ...product,
      classiFies: product.classiFies.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
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
        setProduct((prev) => ({
          ...prev,
          images: reponse.data,
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    console.log(product)
    await myAxios
      .post("products",product,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        handleClose()
        handleRefresh()
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };
  // thêm sản phẩm

  // tin nhan
  const handleOpenM = () => {
    getMess();
    setOpenM(true);
  };
  const handleCloseM = () => {
    setReply(null);
    setOpenM(false);
    setMessage(null);
  };

  const reload = () => {
    getMess();
  };

  const handleReplyChange = (e) => setReply(e.target.value);

  const handleSendReply = () => {
    if (reply == null) return;
    const data = {
      receiver: sender,
      message: reply,
      username: localStorage.getItem("user"),
    };
    console.log(data, code);
    ws.send(JSON.stringify(data));
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Shop Management" subtitle="Welcome to your management" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleOpen}
          >
            Thêm Sản Phẩm
          </Button>
        </Box>
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleOpenM}
          >
            Chat
          </Button>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          getRowId={() => crypto.randomUUID()}
          rows={productBySell}
          columns={columns}
        />
      </Box>
      {/* modal */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-title" variant="h6" component="h2">
            Thêm Sản Phẩm
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} marginTop={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên Sản Phẩm"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô Tả"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-code-label">Danh Mục</InputLabel>
                  <Select
                    labelId="category-code-label"
                    name="categoryCode"
                    value={product.categoryCode}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.code}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giá"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giảm Giá"
                  name="saleOff"
                  type="number"
                  value={product.saleOff}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Danh Sách Phân Loại</Typography>
                <Box style={{ maxHeight: "22vh", overflow: "auto" }}>
                  {product.classiFies.map((classiFie, index) => (
                    <Box
                      key={index}
                      marginBottom={2}
                      padding={2}
                      border={1}
                      borderRadius={1}
                      borderColor="grey.300"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Tên Nhóm"
                            value={classiFie.groupName}
                            onChange={(e) =>
                              handleClassiFiesChange(
                                index,
                                "groupName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Tên"
                            value={classiFie.name}
                            onChange={(e) =>
                              handleClassiFiesChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button variant="contained" component="label">
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) =>
                                handleClassiFiesImageChange(index, e)
                              }
                            />
                            {classiFie.image ? (
                              <img
                                src={
                                  `${classiFie.image}`.includes("http")
                                    ? classiFie.image
                                    : `http://localhost:5181/api/get/image/${classiFie.image}`
                                }
                                alt={classiFie.image}
                                style={{ width: 100, height: 100 }}
                              />
                            ) : (
                              "Chọn Hình Ảnh"
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Số Lượng"
                            type="number"
                            value={classiFie.quantity}
                            onChange={(e) =>
                              handleClassiFiesChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} textAlign="right">
                          <IconButton
                            color="error"
                            onClick={() => removeClassiFie(index)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addClassiFie}
                  sx={{ marginTop: 2 }}
                >
                  Thêm Phân Loại
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Ảnh sản phẩm</Typography>
                <Button
                  component="label"
                  variant="contained"
                  color="success"
                  startIcon={<CloudUploadIcon />}
                  m="10px"
                >
                  Upload Ảnh Sản Phẩm
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </Button>
                <Box style={{ maxHeight: "15vh", overflow: "auto" }}>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={
                        `${image}`.includes("http")
                          ? image
                          : `http://localhost:5181/api/get/image/${image}`
                      }
                      alt={`Product Preview ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button variant="contained" type="submit">
                  {/* {loading ? <CircularProgress size={24} /> : "Lưu"} */} luu
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      {/* tin nhắn */}
      <Modal
        open={openM}
        onClose={handleCloseM}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          marginTop: "50px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "80%",
            width: "80%",
            margin: "auto",
            backgroundColor: "background.paper",
            border: "1px solid rgb(105 85 31)",
            boxShadow: 24,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          {/* Danh Sách Tin Nhắn */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ padding: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6">Danh Sách Tin Nhắn</Typography>
            </Box>
            <Box
              sx={{
                width: 300,
                borderRight: 1,
                height: "100%",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <List>
                {listMessage.map((msg, index) => (
                  <React.Fragment key={msg.code}>
                    <List
                      key={index}
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        borderRight: "1px solid #ddd",
                        backgroundColor:
                          selectedChat === index ? "#d1eaff" : "transparent",
                        "&:hover": {
                          backgroundColor:
                            selectedChat === index ? "#b0d1ff" : "#e0e0e0",
                        },
                      }}
                      button
                      onClick={() =>
                        handleSelectMessage(
                          msg.code,
                          msg.sender.username,
                          index
                        )
                      }
                    >
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            sx={{ marginRight: 2 }}
                            src={
                              `${msg.sender.avatar}`.includes("http")
                                ? msg.sender.avatar
                                : `http://localhost:5181/api/get/image/${msg.sender.avatar}`
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={msg.sender.name}
                          secondary={
                            <React.Fragment>
                              {msg.countMessNotRead == 0 ? (
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {msg.lastMessage}
                                </Typography>
                              ) : (
                                `${msg.lastMessage}`
                              )}
                            </React.Fragment>
                          }
                        />
                        {msg.countMessNotRead == 0 ? null : (
                          <Badge
                            badgeContent={msg.countMessNotRead}
                            color="success"
                          />
                        )}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </List>
                  </React.Fragment>
                ))}
              </List>
              <Button
                component={Link}
                onClick={reload}
                variant="contained"
                color="success"
                sx={{ fontSize: "1rem" }}
              >
                <ReloadIcon sx={{ fontSize: "24px" }} />
                Làm mới
              </Button>
            </Box>
          </Box>

          {/* Chi Tiết Tin Nhắn */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                width: "100%",
                margin: "20px auto",
                padding: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                height: "1000px !important",
                display: "flex",
                flexDirection: "column-reverse",
                overflowY: "auto",
              }}
            >
              {message ? (
                <Box>
                  <List>
                    {message
                      .slice()
                      .reverse()
                      .map((msg) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection:
                              msg.sender.username ==
                              localStorage.getItem("user")
                                ? "row-reverse"
                                : "row",
                            mb: 2,
                            alignItems: "flex-end",
                          }}
                        >
                          <ListItemAvatar>
                            {msg.sender.username ==
                            localStorage.getItem("user") ? (
                              <Avatar
                                sx={{ marginRight: 2 }}
                                src={
                                  `${msg.sender.avatar}`.includes("http")
                                    ? msg.sender.avatar
                                    : `http://localhost:5181/api/get/image/${msg.sender.avatar}`
                                }
                              />
                            ) : (
                              <Avatar
                                sx={{ marginRight: 2 }}
                                src={
                                  `${msg.receiver.avatar}`.includes("http")
                                    ? msg.receiver.avatar
                                    : `http://localhost:5181/api/get/image/${msg.receiver.avatar}`
                                }
                              />
                            )}
                          </ListItemAvatar>
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor:
                                msg.sender.username ==
                                localStorage.getItem("user")
                                  ? "#007bff"
                                  : "#e0e0e0",
                              color:
                                msg.sender.username ==
                                localStorage.getItem("user")
                                  ? "#fff"
                                  : "#000",
                              wordWrap: "break-word",
                            }}
                          >
                            <Typography variant="body1">{msg.text}</Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                textAlign:
                                  msg.sender.username ==
                                  localStorage.getItem("user")
                                    ? "right"
                                    : "left",
                                color: "#888",
                                mt: 0.5,
                              }}
                            >
                              {convertTimeString(msg.createdAt)}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                  </List>
                </Box>
              ) : (
                <Typography variant="h6">
                  Chọn một tin nhắn để xem chi tiết.
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                padding: 2,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Nhập tin nhắn..."
                value={reply}
                onChange={handleReplyChange}
                sx={{ marginRight: 1 }}
              />
              <IconButton color="primary" onClick={handleSendReply}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Seller;

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
