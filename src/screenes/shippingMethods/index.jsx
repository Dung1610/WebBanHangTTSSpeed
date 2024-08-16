import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { CheckRoleInAdmin, NoLogin } from "../../custom/LoginProcess";
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
import CardContent from "@mui/material/CardContent";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: "▴",
        },
        decrementButton: {
          children: "▾",
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
  CheckRoleInAdmin()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [newShippingMethods, setNewShippingMethods] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const handleOpen2 = () => setOpenModal2(true);
  const handleClose2 = () => setOpenModal2(false)
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setNewShippingMethods(null)
    setPosition(null)
    setSearchQuery(null)
    setOpenModal(false)
    setValueEnsure(null)
    setValuePrice(null)
  }
  const [valueEnsure, setValueEnsure] = React.useState(null);
  const [valuePrice, setValuePrice] = React.useState(null);
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const handleRefresh = () => {
    setFetchTrigger(prev => !prev);
  };
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
        map.setView([position.lat, position.lng]); // Cập nhật vị trí và zoom level
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
  }, [fetchTrigger]);

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

  const addNewShippingMethods = () =>{
    handleClose()
    handleClose2()
    setIsLoading(true)
    myAxios
    .post(
      "shippingMethods",
      {
        name: newShippingMethods,
        location: searchQuery,
        lat: `${position.lat}`,
        long: `${position.lng}`,
        ensure: valueEnsure,
        price: valuePrice
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then(function (response) {
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
        <Header title="Quản Lí Vận Chuyển"/>
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
          <CardActions dir="rtl">
            <Button size="large" onClick={handleClose} variant="outlined" color="error">
              <Typography gutterBottom variant="h5" component="div">
                Đóng
              </Typography>
            </Button>
            {newShippingMethods != null && valueEnsure != null && valuePrice != null && searchQuery != null ? 
            <Button sx={{ mr: "15px" }} onClick={handleOpen2} size="large" variant="outlined" color="success">
            <Typography gutterBottom variant="h5" component="div">
              Thêm
            </Typography>
          </Button>
            : null}
          </CardActions>
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
            style={{ height: "40vh", width: "100vh" }}
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
          <Box sx={{m:'10px' , display: 'flex', alignItems: 'flex-end' }}>
          <Typography>
                Tên Đơn Vị Vận Chuyển
          </Typography>
          <TextField
            id="input-with-sx"
            label="Tên Đơn Vị Vận Chuyển"
            variant="filled"
            size="medium"
            required
            fullWidth
            onChange={(e) => setNewShippingMethods(e.target.value)}
          />
          </Box>
              <Typography variant="h5" sx={{mt: '10px'}}>
                Giới Hạn Giao
              </Typography>
              <NumberInput
                aria-label="Demo number input"
                placeholder="Type a number…"
                value={valueEnsure}
                onChange={(e,val) => setValueEnsure(val)}
              />
              <Typography variant="h5" sx={{mt: '10px'}}>
                Giá
              </Typography>
              <NumberInput
                aria-label="Demo number input"
                placeholder="Type a number…"
                value={valuePrice}
                onChange={(e,val) => setValuePrice(val)}
              />
        </Box>
      </Modal>

{/* modal 2 */}
          <Modal
          open={openModal2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Tên Đơn Vị: {newShippingMethods}
              </Typography>
              <Typography variant="h4" color="text.secondary">
                Địa Chỉ: {searchQuery}
              </Typography>
              <Typography variant="h4" color="text.secondary">
                Giới Hạn Giao: {valueEnsure} 
              </Typography>
              <Typography variant="h4" color="text.secondary">
               Giá: {valuePrice} 
               {/* Vĩ độ: {position.lat} <br /> Kinh độ: {position.lng} */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="large"  color="inherit">
                <Typography gutterBottom  variant="h5" onClick={()=>addNewShippingMethods()} component="div">
                  Thêm Địa Chỉ Mới
                </Typography>
              </Button>
              <Button size="large" onClick={handleClose2} color="inherit">
                <Typography gutterBottom variant="h5" component="div">
                  Quay Lại
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

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`
);

const StyledButton = styled("button")(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 0;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  }
  & .arrow {
    transform: translateY(-1px);
  }
`
);
