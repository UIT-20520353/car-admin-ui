import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import appConstant from "../app/constant";
import { getProfile } from "../redux/authSlice";
import LeftSidebar from "./LeftSidebar";
import ModalLayout from "./ModalLayout";
import PageContent from "./PageContent";
import RightSidebar from "./RightSidebar";

function Layout() {
  const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else {
      dispatch(getProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <>
      {/* Left drawer - containing page content and side bar (always open) */}
      <div className="drawer lg:drawer-open" data-theme="light">
        <input
          id="left-sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <PageContent />
        <LeftSidebar />
      </div>

      {/* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar />

      {/* Modal layout container */}
      <ModalLayout />
    </>
  );
}

export default Layout;
