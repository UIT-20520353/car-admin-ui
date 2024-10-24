import React, { lazy, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { themeChange } from "theme-change";
import "./App.css";
import initializeApp from "./app/init";
import InternalPage from "./pages/protected/404";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const Register = lazy(() => import("./pages/Register"));
// const Documentation = lazy(() => import("./pages/Documentation"));

initializeApp();

function App() {
  // const token = useAuth();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<InternalPage />} />
        <Route path="/*" element={<Layout />}></Route>
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/documentation" element={<Documentation />} /> */}

        {/* Place new routes over this */}
        {/* <Route path="/app/*" element={<Layout />} /> */}

        {/* <Route
        path="*"
        element={
          <Navigate to={token ? "/app/welcome" : "/login"} replace />
        }
      /> */}
      </Routes>
    </Router>
  );
}

export default App;
