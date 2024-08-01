import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./screenes/global/Topbar";
import Dashboard from "./screenes/dashboard";
import Sidebarr from "./screenes/global/Sidebar";
import UserTable from "./screenes/userTable";
import Invoices from "./screenes/invoices";
import Contacts from "./screenes/contacts";
import Bar from "./screenes/bar";
import Form from "./screenes/form";
import Line from "./screenes/line";
import Pie from "./screenes/pie";
import FAQ from "./screenes/faq";
import Geography from "./screenes/geography";
import Calendar from "./screenes/calendar";
import Login from "./screenes/login";
import CategoryTable from "./screenes/categoryTable";
import LogList from "./screenes/logList";
import ListCard from "./screenes/listCard";

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
              <Route path="/categoryTable" element={<CategoryTable />} />
              <Route path="/logList" element={<LogList />} />
              <Route path="/listCard" element={<ListCard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/login/:tokenExpired?" element={<Login />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
