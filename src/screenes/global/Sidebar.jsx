import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeModeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import HistoryIcon from "@mui/icons-material/History";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Link to={to} className="router-link">
      <MenuItem
        active={selected === to}
        style={{ color: colors.grey[100] }}
        onClick={() => setSelected(to)}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

const Sidebarr = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = window.location.pathname;
  const [selected, setSelected] = useState(pathname);

  

  if (localStorage.getItem("token") && localStorage.getItem("role")) {
    const view =
      localStorage.getItem("role") === "quan-tri-vien" ? (
        <>
          <Box>
            <Sidebar
              collapsed={isCollapsed}
              style={{ height: "100%", borderColor: colors.primary[400] }}
              backgroundColor={colors.primary[400]}
              width="100%"
            >
              <Menu>
                {/* Logo and menu icon */}
                <MenuItem
                  onClick={() => {
                    setIsCollapsed(!isCollapsed);
                  }}
                  icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                  style={{
                    margin: "10px 0 20px 0",
                    color: colors.grey[100],
                  }}
                >
                  {!isCollapsed && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      ml="15px"
                    >
                      <Typography variant="h3" color={colors.grey[100]}>
                        {localStorage.getItem("name") == "admin"
                          ? "Admin Page"
                          : "Shop Speed"}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setIsCollapsed(!isCollapsed);
                        }}
                      >
                        <MenuOutlinedIcon />
                      </IconButton>
                    </Box>
                  )}
                </MenuItem>

                {/* USER */}
                {!isCollapsed && (
                  <Box mb="25px">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        alt="profile-user"
                        width="100px"
                        height="100px"
                        src={
                          `${localStorage.getItem("image")}`.includes("http")
                            ? localStorage.getItem("image")
                            : `http://localhost:5181/api/get/image/${localStorage.getItem(
                                "image"
                              )}`
                        }
                        style={{ cursor: "pointer", borderRadius: "50px" }}
                      />
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                      >
                        {localStorage.getItem("name")}
                      </Typography>
                      <Typography variant="h5" color={colors.greenAccent[600]}>
                        {localStorage.getItem("user")}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Menu item */}
                <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                  <Item
                    title="Dashboard"
                    to="/dashboard"
                    icon={<HomeModeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    Quản Lí
                  </Typography>

                  <Item
                    title="Users Table"
                    to="/userTable"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Category Table"
                    to="/categoryTable"
                    icon={<CategoryOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="List Log"
                    to="/logList"
                    icon={<AlarmOnIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="List Bill"
                    to="/listBill"
                    icon={<AttachMoneyIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Banner"
                    to="/banner"
                    icon={<ViewCarouselIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="ShippingMethods"
                    to="/shippingMethods"
                    icon={<HistoryIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </Menu>
            </Sidebar>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Sidebar
              collapsed={isCollapsed}
              style={{ height: "100%", borderColor: colors.primary[400] }}
              backgroundColor={colors.primary[400]}
              width="100%"
            >
              <Menu>
                {/* Logo and menu icon */}
                <MenuItem
                  onClick={() => {
                    setIsCollapsed(!isCollapsed);
                  }}
                  icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                  style={{
                    margin: "10px 0 20px 0",
                    color: colors.grey[100],
                  }}
                >
                  {!isCollapsed && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      ml="15px"
                    >
                      <Typography variant="h3" color={colors.grey[100]}>
                        {localStorage.getItem("name") == "admin"
                          ? "Admin Page"
                          : "Shop Speed"}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setIsCollapsed(!isCollapsed);
                        }}
                      >
                        <MenuOutlinedIcon />
                      </IconButton>
                    </Box>
                  )}
                </MenuItem>

                {/* USER */}
                {!isCollapsed && (
                  <Box mb="25px">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        alt="profile-user"
                        width="100px"
                        height="100px"
                        src={
                          `${localStorage.getItem("image")}`.includes("http")
                            ? localStorage.getItem("image")
                            : `http://localhost:5181/api/get/image/${localStorage.getItem(
                                "image"
                              )}`
                        }
                        style={{ cursor: "pointer", borderRadius: "50px" }}
                      />
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                      >
                        {localStorage.getItem("name")}
                      </Typography>
                      <Typography variant="h5" color={colors.greenAccent[600]}>
                        {localStorage.getItem("user")}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Menu item */}
                <Box paddingLeft={isCollapsed ? undefined : "10%"}></Box>
              </Menu>
            </Sidebar>
          </Box>
        </>
      );
    return view;
  } else {
    return <></>;
  }
};

export default Sidebarr;
