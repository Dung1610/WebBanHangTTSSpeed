import {
  Box,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { NoLogin } from "../../custom/LoginProcess";
import CustomPagination from "../../custom/CustomPagination";
import { useEffect, useState } from "react";
import { CheckExpired } from "../../custom/LoginProcess";
import { myAxios } from "../../Services/axios";
import CardActions from "@mui/material/CardActions";
import Modal from "@mui/material/Modal";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ControlGeocoder from "leaflet-control-geocoder";
import L from "leaflet";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Tạo một icon tùy chỉnh cho marker
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onClick(lat, lng);
    },
  });
  return null;
};

const ShippingMethods = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMapClick = (lat, lng) => {
    var urlGetUser = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    fetch(urlGetUser)
      .then((response) => response.json())
      .then((data) => {
        setSearchQuery(data.display_name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setPosition({ lat, lng });
  };

  const handleSearch = () => {
    const geocoder = ControlGeocoder.nominatim();
    geocoder.geocode(searchQuery, (results) => {
      if (results && results.length > 0) {
        const { lat, lng } = results[0].center;
        setPosition({ lat, lng });
      } else {
        alert("No results found");
      }
    });
  };

  // Thành phần để di chuyển bản đồ đến vị trí mới
  const MapUpdater = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
      if (position) {
        map.setView([position.lat, position.lng], 11); // Cập nhật vị trí và zoom level
      }
    }, [position, map]);
    return null;
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "code",
      headerName: "Code",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "lat",
      headerName: "Lat",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "long",
      headerName: "long",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "ensure",
      headerName: "ensure",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "price",
      headerName: "price",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "status",
      flex: 2,
      cellClassName: "name-column--cell",
    },
  ];

  useEffect(() => {
    getshippingMethods();
  }, []);

  const getshippingMethods = () => {
    myAxios
      .get(`shippingMethods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setShippingMethods(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box m="20px">
      <Box display="flex">
        <Header title="USER TABLE" subtitle="Managing the User" />
      </Box>
      <Button
        size="small"
        onClick={handleOpen}
        variant="contained"
        color="success"
      >
        <Typography gutterBottom variant="h6" component="div">
          Thêm Địa Chỉ
        </Typography>
      </Button>
      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "1.5rem" }}
              placeholder="Search"
              inputProps={{ "aria-label": "search google maps" }}
              id="fullWidth"
              variant="filled"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton onClick={handleSearch} sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <MapContainer
            center={[21.0283334, 105.854041]}
            zoom={10}
            style={{ height: "70vh", width: "70vh" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onClick={handleMapClick} />
            <MapUpdater position={position} />
            {position && (
              <Marker position={[position.lat, position.lng]} icon={customIcon}>
                <Popup>
                  Vĩ độ: {position.lat} <br /> Kinh độ: {position.lng} <br />{" "}
                  Địa Chỉ: {searchQuery}
                </Popup>
              </Marker>
            )}
          </MapContainer>
          <CardActions>
            <Button size="large" color="inherit">
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={shippingMethods}
          columns={columns}
          getRowId={() => crypto.randomUUID()}
          slots={{
            toolbar: GridToolbar,
            pagination: CustomPagination,
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 13 } },
          }}
          loading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default ShippingMethods;
