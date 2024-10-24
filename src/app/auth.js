import axios from "axios";
import appConstant from "./constant";
import { useLocation } from "react-router-dom";

const useAuth = () => {
  const location = useLocation();
  /*  Getting token value stored in localstorage, if token is not present we will open login page 
    for all internal dashboard routes  */
  const TOKEN = localStorage.getItem(appConstant.TOKEN_KEY);
  const PUBLIC_ROUTES = [
    "login",
    "forgot-password",
    "register",
    "documentation",
  ];

  const isPublicPage = PUBLIC_ROUTES.some((r) => location.pathname.includes(r));

  console.log(isPublicPage, TOKEN);

  if (!TOKEN && !isPublicPage) {
    window.location.href = "/login";
    return;
  } else {
    axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

    axios.interceptors.request.use(
      function (config) {
        // UPDATE: Add this code to show global loading indicator
        document.body.classList.add("loading-indicator");
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        // UPDATE: Add this code to hide global loading indicator
        document.body.classList.remove("loading-indicator");
        return response;
      },
      function (error) {
        document.body.classList.remove("loading-indicator");
        return Promise.reject(error);
      }
    );
    return TOKEN;
  }
};

export default useAuth;