import {
  List,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Popup from "reactjs-popup";

const category = {
  code: "",
  id: "",
  level: "",
  name: "",
  parent: "",
};

const NodeDetail = ({}) => {
  const close = () => {};
  return (
    <div
      className="modal"
      style={{
        backgroundColor: "#000",
        width: "500px",
        height: "500px",
      }}
    >
      <div className="content">Welcome to GFG!!!</div>
      <div>
        <button onClick={() => close()}>Close modal</button>
      </div>
    </div>
  );
};

const TreeNode = ({ node }) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton sx={{ pl: (node.level + 1) * 4 }}>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary={node.name} />

        <Popup
          trigger={
            <Button
              variant="contained"
              color="success"
              //   onClick={handleItemClick}
            >
              <Typography variant="h6" color="#fff">
                Xem Chi Tiết
              </Typography>
            </Button>
          }
          modal
          nested
        >
          {NodeDetail}
        </Popup>

        {open ? (
          <Button onClick={handleClick}>
            <ExpandMore />
          </Button>
        ) : (
          <Button onClick={handleClick}>
            <ExpandLess />
          </Button>
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {node.children && node.children.length > 0 && (
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <TreeNode node={child} />
            ))}
          </List>
        )}
      </Collapse>
    </>
  );
};

const Tree = ({ data }) => {
  return (
    <List
      sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          CÂY DANH MỤC
        </ListSubheader>
      }
    >
      {data.map((rootNode) => (
        <TreeNode key={rootNode.id} node={rootNode} />
      ))}
    </List>
  );
};

export default Tree;
