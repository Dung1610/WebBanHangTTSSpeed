import { Box, IconButton, useTheme } from "@mui/material";
import * as React from "react";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Badge from "@mui/material/Badge";
import LogoutOutlineIcon from "@mui/icons-material/LogoutOutlined";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { myAxios } from "../../Services/axios";

const Topbar = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [invisible, setInvisible] = React.useState(false);
  const [thongBao, setThongBao] = React.useState([]);
  const [anchor, setAnchor] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const handleBadgeVisibility = (event) => {
    setInvisible(!invisible);
    setAnchor(event.currentTarget);
  };

  React.useEffect(() => {
    getThongBao();
  }, []);

  const getThongBao = () => {
    myAxios
      .get(
        `http://localhost:5181/api/users/notifications/${localStorage.getItem(
          "user"
        )}?status=-1`
      )
      .then((reponse) => {
        setThongBao(reponse.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box display="flex" sx={{ justifyContent: "flex-end" }} p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon fontSize="large" />
          ) : (
            <LightModeOutlinedIcon fontSize="large" />
          )}
        </IconButton>
        {localStorage.getItem("token") && (
          <>
            {localStorage.getItem("role") == "nguoi-ban" ? (
              <>
                <IconButton onClick={handleBadgeVisibility}>
                  <Badge color="secondary" invisible={invisible}>
                    <NotificationsOutlinedIcon fontSize="large" />
                  </Badge>
                </IconButton>
                <Popover
                  open={Boolean(anchor)}
                  anchorEl={anchor}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                  }}
                  onClose={() => setAnchor(null)}
                >
                  <List
                    style={{ maxHeight: "30vh", overflow: "auto" }}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    {thongBao.map((i) => (
                      <ListItem>
                      <ListItemText primary={i.message} secondary={i.createdAt} />
                    </ListItem>
                    ))}
                  </List>
                </Popover>
              </>
            ) : null}
            <IconButton onClick={handleLogout}>
              <LogoutOutlineIcon fontSize="large" />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
