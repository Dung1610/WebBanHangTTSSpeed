import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { NoLogin } from "../../custom/LoginProcess";
import { useEffect, useState } from "react";
import { CheckExpired } from "../../custom/LoginProcess";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { myAxios } from "../../Services/axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomPagination from "../../custom/CustomPagination";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";

const ListBill = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = React.useState(-1);
  const [billAll, setBillAll] = useState([]);
  const [result, setResult] = useState([]);
  const [anchor, setAnchor] = useState(null);
  const openPopover = (event) => {
    setAnchor(event.currentTarget);
  };

  const columns = [
    {
      field: "user",
      headerName: "Người Dùng",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { user } }) => {
        return (
          <>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={`${user.avatar}`.includes("http") ? user.avatar :`http://localhost:5181/api/get/image/${user.avatar}`} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name ? user.name : "null"}
                secondary={
                  <React.Fragment>
                    <Typography>{user.email ? user.email : "null"}</Typography>
                    {user.phone ? user.phone : "null"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Ngày Tạo",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "address",
      headerName: "Địa Chỉ",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { address } }) => {
        return (
          <>
            {address.description}
          </>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Số Lượng",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "totalPrice",
      headerName: "Tổng Tiền Phải Trả",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "totalProductPrice",
      headerName: "Tiền Sản Phẩm",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      headerName: "Tiền Giao Hàng",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { totalPrice,totalProductPrice } }) => {
        return (
          <>
            {totalPrice - totalProductPrice}
          </>
        );
      },
    },
    {
      field: "billItems",
      headerName: "Đơn Hàng",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { billItems,shippingMethod } }) => {
        return (
          <>
             <Button
              variant="contained"
              onClick={openPopover}
              sx={{ width: "100%"}}
            >
              Xem Đơn Hàng
            </Button>
            <Popover
              open={Boolean(anchor)}
              anchorEl={anchor}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
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
              >
          {billItems.map((i)=>(
            <ListItem>
              <ListItemAvatar>
              <Avatar src={`${i.product.images[0]}`.includes("http") ? i.product.images[0] :`http://localhost:5181/api/get/image/${i.product.images[0]}`} />
            </ListItemAvatar>
            <ListItemText primary={<React.Fragment>
              <Typography>
                Tên Sản Phẩm: {i.product.name}
              </Typography>
              <Typography>
                Phân Loại: {i.productClassifies}
              </Typography>
              <Typography>
                Giá Mua: {i.product.priceSaleOff ? i.product.priceSaleOff : i.product.price}
              </Typography>
              <Typography>
                Phương Thức Giao: {shippingMethod.name}
              </Typography>
            </React.Fragment>} />
            </ListItem>
              ))}
              </List>
            </Popover>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng Thái",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { status,code } }) => {
        if(status == 0){
          return (
            <>
              <Button
                variant="contained"
                sx={{ width: "100%",backgroundColor:"red"}}
                onClick={()=>updateStatus(code,status+1)}
              >
                Thanh Toán
              </Button>
            </>
          );
        }else if(status == 1){
          return (
            <>
              <Button
                variant="contained"
                sx={{ width: "100%",backgroundColor:"pink"}}
                onClick={()=>updateStatus(code,status+1)}
              >
                Vận Chuyển
              </Button>
            </>
          );
        }else if(status == 2){
          return (
            <>
              <Button
                variant="contained"
                sx={{ width: "100%",backgroundColor:"yellowgreen"}}
                onClick={()=>updateStatus(code,status+1)}
              >
                Giao Hàng
              </Button>
            </>
          );
        }else if(status == 3){
          return (
            <>
              <Button
                variant="contained"
                sx={{ width: "100%",backgroundColor:"green"}}
                disabled
              >
                Hoàn Thành
              </Button>
            </>
          );
        }
      },
    },
  ];
  useEffect(() => {
    getBill();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const rol = new Array();
    let i = 0;
    if(value == -1){
      setResult(billAll)
    setIsLoading(false);
    }else{
      while (billAll[i] != null) {
        if (billAll[i].status == value) {
          rol.push(billAll[i]);
          }
          i++;
        }
    setResult(rol)
    setIsLoading(false);
    }
  }, [value]);

  const getBill = () => {
    setIsLoading(true);
    myAxios
      .get("bills", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setBillAll(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };

  const updateStatus = (code,status) => {
    setIsLoading(true);
    myAxios
      .post("bills/update-status",
        {
          code: code,
          status: status
        },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        getBill()
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  }

  return (
    <Box m="10px">
      <Header
        title="Hoá Đơn"
        subtitle="Hiển thị danh sách hoá đơn người dùng"
      />
      <Box sx={{ borderBottom: 1, borderColor: 'Highlight' }}>
        <Tabs textColor="inherit" value={value} onChange={(e,value)=>setValue(value)}>
        <Tab label="Tất Cả" value={-1}/>
          <Tab label="Chưa Thanh Toán" value={0}/>
          <Tab label="Chưa Vận Chuyển" value={1}/>
          <Tab label="Chờ Giao Hàng / Đã Vận Chuyển" value={2}/>
          <Tab label="Hoàn Thành" value={3}/>
        </Tabs>
      </Box>
      <Box
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
          rows={result}
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
          rowHeight={90}
        />
      </Box>
    </Box>
  );
};

export default ListBill;
