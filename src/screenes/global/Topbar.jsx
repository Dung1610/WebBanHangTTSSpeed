import { Box, IconButton, useTheme } from "@mui/material";
import * as React from 'react';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import Badge from '@mui/material/Badge';
import LogoutOutlineIcon from "@mui/icons-material/LogoutOutlined";
import { Link } from "react-router-dom";

const Topbar = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [invisible, setInvisible] = React.useState(false);
  const [badge, setBadge] = React.useState(9);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };

  return (
    <Box display="flex" sx={{justifyContent: 'flex-end'}} p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode} >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon  fontSize="large"/>
          ) : (
            <LightModeOutlinedIcon fontSize="large"/>
          )}
        </IconButton>


        <IconButton onClick={handleBadgeVisibility} title={`Bạn Có ${badge} Thông Báo`}>
      <Badge badgeContent={badge} color="secondary" invisible={invisible}>
        <NotificationsOutlinedIcon fontSize="large"/>
      </Badge>


    </IconButton>
        {localStorage.getItem("token") && (
          <>
            <IconButton onClick={handleLogout}>
              <LogoutOutlineIcon fontSize="large"/>
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
