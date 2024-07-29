import { useTheme } from "@emotion/react";
import { CheckExpired, NoLogin } from "../../custom/LoginProcess";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import Tree from "../../custom/Tree";
import Popup from "reactjs-popup";

const CategoryTable = () => {
  CheckExpired();
  NoLogin();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [listCategory, setListCategory] = useState([]);
  const [listLevel, setListLevel] = useState([]);

  useEffect(() => {
    //get list level , category
    getCategories();
  }, []);

  const getCategories = () => {
    var urlGetRole = "http://localhost:5181/api/categories/false";
    fetch(urlGetRole, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setListCategory(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box m="20px">
      <Box display="flex">
        <Header title="CATEGORIES TABLE" subtitle="Managing the Category" />
      </Box>
      <Tree data={listCategory} />
    </Box>
  );
};

export default CategoryTable;
