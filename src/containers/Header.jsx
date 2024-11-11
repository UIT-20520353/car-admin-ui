import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageTitle } = useSelector((state) => state.header);

  const logoutUser = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className="sticky top-0 z-10 shadow-md navbar bg-base-100"
      data-theme="light"
    >
      {/* Menu toogle for mobile view or small screen */}
      <div className="flex-1">
        <label
          htmlFor="left-sidebar-drawer"
          className="btn btn-primary drawer-button lg:hidden"
        >
          <Bars3Icon className="inline-block w-5 h-5" />
        </label>
        <h1 className="ml-2 text-2xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex-none ">
        <div className="ml-4 dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="profile"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            {/* <li className="justify-between">
            <Link to={"/app/settings-profile"}>
              Profile Settings
              <span className="badge">New</span>
            </Link>
          </li>
          <li className="">
            <Link to={"/app/settings-billing"}>Bill History</Link>
          </li>
          <div className="mt-0 mb-0 divider"></div> */}
            <li>
              <button onClick={logoutUser}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
