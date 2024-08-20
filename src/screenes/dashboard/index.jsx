import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
  useTheme,
  Paper,
  TextField,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ReloadIcon from "@mui/icons-material/ReplayOutlined";
import {
  CheckExpired,
  CheckRoleInAdmin,
  NoLogin,
} from "../../custom/LoginProcess";
import React, { useEffect, useState } from "react";
import { myAxios } from "../../Services/axios";
import { Link } from "react-router-dom";

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

const Dashboard = () => {
  CheckExpired();
  NoLogin();
  CheckRoleInAdmin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [ws, setWs] = useState(false);
  const [listMessage, setListMessage] = useState([]);
  const [message, setMessage] = useState([]);
  const [reply, setReply] = useState("");
  const [code, setCode] = useState(0);
  const [sender, setSender] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [openM, setOpenM] = useState(false);

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
        console.log(response.data);
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setSender(sender);

    const socket = new WebSocket(`ws://192.168.2.156:8000/ws/chat/${code}`);
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
  
  const reload = () => {
    getMess();
  }
  useEffect(() => {
    getMess();
  }, []);

  // tin nhan
  const handleOpenM = () => setOpenM(true);
  const handleCloseM = () => {
    setReply(null);
    setOpenM(false);
    setMessage(null);
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
    setReply("")
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
            onClick={handleOpenM}
          >
            Chat
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>

      {/* tin nhan */}
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
            border: "1px solid rgb(105 85 31)",
            margin: "auto",
            backgroundColor: "background.paper",
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
                height: 800,
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
                                  `${msg.sender.avatar}`.includes("http")
                                    ? msg.sender.avatar
                                    : `http://localhost:5181/api/get/image/${msg.sender.avatar}`
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

export default Dashboard;
