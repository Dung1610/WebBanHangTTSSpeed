import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./screenes/global/Topbar";
import Dashboard from "./screenes/dashboard";
import Sidebarr from "./screenes/global/Sidebar";
import UserTable from "./screenes/userTable";
import Login from "./screenes/login";
import CategoryTable from "./screenes/categoryTable";
import LogList from "./screenes/logList";
import ProductCategory from "./screenes/productCategory";
import ShippingMethods from "./screenes/shippingMethods";
import ListBill from "./screenes/listBill";
import Panner from "./screenes/panner";
import Seller from "./screenes/seller";
import Page404 from "./screenes/404";

function App() {
  const [theme, colorMode] = useMode();
  let sidebar;
  let page404;
  const getQueryParams = window.location.href.split("/")[3];

  if (
    getQueryParams != "dashboard" &&
    getQueryParams != "seller" &&
    getQueryParams != "userTable" &&
    getQueryParams != "categoryTable" &&
    getQueryParams != "product" &&
    getQueryParams != "logList" &&
    getQueryParams != "panner" &&
    getQueryParams != "shippingMethods" &&
    getQueryParams != "listBill" &&
    getQueryParams != "login"
  ) {
    sidebar = <></>;
    page404 = (
      <Routes>
        <Route path="*" element={<Page404 />} />
      </Routes>
    );
  } else {
    sidebar = <Sidebarr />;
    page404 = <></>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {sidebar}
          <main className="content">
            <Topbar />
            {page404}
            <Routes>
              <Route path="/seller" element={<Seller />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/userTable" element={<UserTable />} />
              <Route path="/categoryTable" element={<CategoryTable />} />
              <Route path="/product/:id" element={<ProductCategory />} />
              <Route path="/logList" element={<LogList />} />
              <Route path="/listBill" element={<ListBill />} />
              <Route path="/banner" element={<Panner />} />
              <Route path="/shippingMethods" element={<ShippingMethods />} />
              <Route path="/login/:tokenExpired?" element={<Login />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
