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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { CheckRoleInAdmin, NoLogin } from "../../custom/LoginProcess";
import CustomPagination from "../../custom/CustomPagination";
import { useEffect, useState } from "react";
import { CheckExpired } from "../../custom/LoginProcess";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
const LogList = () => {
  CheckExpired();
  NoLogin();
  CheckRoleInAdmin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [role, setRole] = useState();
  const [result, setResult] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [listLog, setListLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRoleItems = listRole.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ));

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "message",
      headerName: "Message",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "user",
      headerName: "Người Dùng",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { user } }) => {
        return <><ListItem>
        <ListItemAvatar>
          <Avatar src={user.avatar ? user.avatar : "null"} />
        </ListItemAvatar>
        <ListItemText primary={user.name ? user.name : "null"} secondary={
          <React.Fragment>
          <Typography>
          {user.email ? user.email : "null"}
          </Typography>
          {user.phone ? user.phone : "null"}
        </React.Fragment>
        }/>
</ListItem></>;
      },
    },
  ];
  useEffect(() => {
    getUserAndRole();
      const arr = new Array();
      listLog.forEach((e) => {
        if (e.code == role) {
          arr.push(e);
        }
      });
      setResult(arr)
  }, [role]);

  const getUserAndRole = () => {
    setIsLoading(true);
    var urlGetUser = `http://localhost:5181/api/logs`;
    fetch(urlGetUser, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListLog(data.data)
        const rol = new Array();
        let i = 0;
        while (data.data[i] != null) {
          if (!rol.includes(data.data[i].code)) {
            rol.push(data.data[i].code);
          }
          i++;
        }
        setListRole(rol);
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
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Roles</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={role}
            label="Age"
            variant="outlined"
            onChange={(event) =>setRole(event.target.value)}
          >
            {listRoleItems}
          </Select>
        </FormControl>
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          rows={result ? result : listLog}
          columns={columns}
          rowHeight={90}
          slots={{
            toolbar: GridToolbar,
            pagination: CustomPagination,
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 13 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default LogList;
