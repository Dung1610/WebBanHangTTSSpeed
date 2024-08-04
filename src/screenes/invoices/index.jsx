import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { apiFake, mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { CheckExpired, NoLogin } from "../../custom/LoginProcess";
import { render } from "@testing-library/react";
import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

const Invoices = () => {
  CheckExpired()
  NoLogin()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchor, setAnchor] = useState(null);
  const openPopover = (event) => {
    setAnchor(event.currentTarget);
  };
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      headerName: "Phân Loại",
      flex: 1,
      renderCell: ({ row: { classifies } }) => {
        return (
          <>
          <Button
              variant="contained"
              onClick={openPopover}
              sx={{ width: "100%", bgcolor: "background.paper" }}
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
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
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

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
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
        <DataGrid rows={apiFake} columns={columns} />
      </Box>
    </Box>
  );
};

export default Invoices;
