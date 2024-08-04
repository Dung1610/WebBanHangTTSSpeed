import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { apiFake } from "../../data/mockData";
import Header from "../../components/Header";
import { CheckExpired, NoLogin } from "../../custom/LoginProcess";
import { render } from "@testing-library/react";
import * as React from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { myAxios } from "../../Services/axios";

const ProductCategory = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchor, setAnchor] = useState(null);
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const category = params.id;
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
      field: "author",
      headerName: "Người Bán",
      flex: 2,
      width: 250,
      renderCell: ({ row: { author } }) => {
        return (
          <>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ width: 60, height: 60, marginRight:2 }} m={5} src={author.avatar ? author.avatar : "null"} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="h5">
                      {author.name ? author.name : "null"}
                    </Typography>
                  }
                secondary={
                  <React.Fragment>
                    <Typography variant="h6">
                      {author.email ? author.email : "null"}
                    </Typography>
                    <Typography variant="h6">
                    {author.phone ? author.phone : "null"}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </>
        );
      },
    },
    {
      field: "description",
      headerName: "Miêu Tả",
      sortable: false,
      flex: 1,
      width: 20,
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 1,
      width: 20,
    },
    {
      field: "priceSaleOff",
      headerName: "Giảm Giá ",
      flex: 1,
      width: 20,
    },
    {
      field: "quantitySelled",
      headerName: "Số Lượng Đã Bán",
      flex: 1,
      width: 20,
    },
    {
      field: "classifies",
      headerName: "Phân Loại",
      sortable: false,
      flex: 1,
      width: 40,
      renderCell: ({ row: { classifies } }) => {
        return (
          <>
            <Button
              variant="contained"
              onClick={openPopover}
              sx={{ width: "100%"}}
            >
              Open Popover
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
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
          {classifies.map((i)=>(
            <ListItem>
            <ListItemAvatar>
              <Avatar src={i.image} />
            </ListItemAvatar>
            <ListItemText primary={i.name} secondary={i.quantity} />
          </ListItem>
          ))}
              </List>
            </Popover>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getProductByCategory();
  }, []);
  const getProductByCategory = () => {
    myAxios
      .get(`products/categories?code=${category}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setProduct(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box m="20px">
      <Header title="Sản Phẩm Của Danh Mục" subtitle={category} />
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
          rows={product}
          columns={columns}
          rowHeight={90}
        />
      </Box>
    </Box>
  );
};

export default ProductCategory;
