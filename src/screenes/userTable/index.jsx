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
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { NoLogin } from "../../custom/LoginProcess";
import CustomPagination from "../../custom/CustomPagination";
import { useEffect, useState } from "react";
import { CheckExpired } from "../../custom/LoginProcess";

const UserTable = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [role, setRole] = useState("nguoi-mua");
  const [listRole, setListRole] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRoleItems = listRole.map((number, index) => (
    <MenuItem key={number.code} value={number.code}>
      {number.name}
    </MenuItem>
  ));

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 200,
      renderCell: ({ row: { avatar } }) => {
        return (
          <>
            <Avatar src={avatar} />
          </>
        );
      },
    },
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "address",
      headerName: "address",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { address } }) => {
        return <>{address ? address : "null"}</>;
      },
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      renderCell: ({ row: { phone } }) => {
        return <>{phone ? phone : "null"}</>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { email } }) => {
        return <>{email ? email : "null"}</>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "verifiedAt",
      headerName: "verifiedAt",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "createdAt",
      headerName: "createdAt",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "roleCode",
      headerName: "Role level",
      headerAlign: "left",
      flex: 1,
      renderCell: ({ row: { roleCode } }) => {
        return (
          <Box
            width="60%"
            p="5px"
            display="flex"
            justifyContent="center"
            m="5px"
            backgroundColor={
              roleCode === "quan-tri-vien"
                ? colors.greenAccent[600]
                : roleCode === "nguoi-ban"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {roleCode === "quan-tri-vien" && <AdminPanelSettingsOutlinedIcon />}
            {roleCode === "nguoi-ban" && <SecurityOutlinedIcon />}
            {roleCode === "nguoi-mua" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {roleCode}
            </Typography>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    //get roles
    getRoles();

    //get user
    getUserByRole();
  }, [role]);

  const getRoles = () => {
    var urlGetRole = "http://localhost:5181/api/roles";
    fetch(urlGetRole, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListRole(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getUserByRole = () => {
    setIsLoading(true);
    var urlGetUser = `http://localhost:5181/api/users/role?code=${role}`;
    fetch(urlGetUser, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setListUser(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChange = (event) => {
    setRole(event.target.value);
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
            onChange={handleChange}
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
          checkboxSelection
          rows={listUser}
          columns={columns}
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

export default UserTable;
