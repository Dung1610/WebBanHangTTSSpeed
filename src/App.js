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

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebarr />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/userTable" element={<UserTable />} />
              <Route path="/categoryTable" element={<CategoryTable />}/>
              <Route path="/product/:id" element={<ProductCategory />} />
              <Route path="/logList" element={<LogList />} />
              <Route path="/listBill" element={<ListBill />} />
              <Route path="/panner" element={<Panner />} />
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
