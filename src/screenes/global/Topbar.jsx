import { Box, IconButton, useTheme } from "@mui/material";
import * as React from "react";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import LogoutOutlineIcon from "@mui/icons-material/LogoutOutlined";
import { Link } from "react-router-dom";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const Topbar = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [invisible, setInvisible] = React.useState(false);
  const [badge, setBadge] = React.useState(9);
  const [anchor, setAnchor] = useState(null);
  const openPopover = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    window.location.href = "/login";
  };

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
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
            <IconButton
              onClick={handleBadgeVisibility}
              title={`Bạn Có ${badge} Thông Báo`}
            >
              <Badge
                badgeContent={badge}
                color="secondary"
                invisible={invisible}
                onClick={openPopover}
              >
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
              }}
              onClose={() => setAnchor(null)}
            >
                <List
                style={{maxHeight: '30vh', overflow: 'auto'}}
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                ><ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Brunch this weekend?"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Ali Connors
                      </Typography>
                      {
                        " — I'll be in your neighborhood doing errands this…"
                      }
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" /><ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Ali Connors
                          </Typography>
                          {
                            " — I'll be in your neighborhood doing errands this…"
                          }
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" /><ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Ali Connors
                          </Typography>
                          {
                            " — I'll be in your neighborhood doing errands this…"
                          }
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" /><ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Ali Connors
                          </Typography>
                          {
                            " — I'll be in your neighborhood doing errands this…"
                          }
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Ali Connors
                          </Typography>
                          {
                            " — I'll be in your neighborhood doing errands this…"
                          }
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Travis Howard"
                        src="/static/images/avatar/2.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Summer BBQ"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            to Scott, Alex, Jennifer
                          </Typography>
                          {" — Wish I could come, but I'm out of town this…"}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Cindy Baker"
                        src="/static/images/avatar/3.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Oui Oui"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Sandra Adams
                          </Typography>
                          {
                            " — Do you have Paris recommendations? Have you ever…"
                          }
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </List>
            </Popover>
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
