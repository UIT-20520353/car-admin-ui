import {
  TagIcon,
  UserIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { selectAuthState } from "../redux/authSlice";
import routes from "../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";

function LeftSidebar() {
  const location = useLocation();
  const { profile } = useSelector(selectAuthState);

  const close = (e) => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="z-30 drawer-side" data-theme="light">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="min-h-full pt-2 menu w-80 bg-base-100 text-base-content">
        <button
          className="absolute top-0 right-0 z-50 mt-4 mr-2 btn btn-ghost bg-base-300 btn-circle lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="inline-block w-5 h-5" />
        </button>

        <li className="mb-2 text-xl font-semibold">
          <Link to="/">
            <img
              className="w-10 mask mask-squircle"
              src="/logo192.png"
              alt="DashWind Logo"
            />
            <span className="uppercase">{profile && profile.role}</span>
          </Link>
        </li>
        {routes.map((route, k) => {
          return (
            <li className="" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-semibold  bg-base-200 " : "font-normal"
                    }`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}
        {profile?.role === "ADMIN" && (
          <>
            {/* <li className="">
              <NavLink
                end
                to="/item"
                className={({ isActive }) =>
                  `${isActive ? "font-semibold  bg-base-200 " : "font-normal"}`
                }
              >
                <TagIcon className="w-6 h-6" /> Item
                {location.pathname === "/item" ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                    aria-hidden="true"
                  ></span>
                ) : null}
              </NavLink>
            </li> */}
            <li className="">
              <NavLink
                end
                to="/staff"
                className={({ isActive }) =>
                  `${isActive ? "font-semibold  bg-base-200 " : "font-normal"}`
                }
              >
                <UserIcon className="w-6 h-6" /> Staff
                {location.pathname === "/staff" ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                    aria-hidden="true"
                  ></span>
                ) : null}
              </NavLink>
            </li>
            <li className="">
              <NavLink
                end
                to="/logs"
                className={({ isActive }) =>
                  `${isActive ? "font-semibold  bg-base-200 " : "font-normal"}`
                }
              >
                <DocumentArrowDownIcon className="w-6 h-6" /> Log Tracking
                {location.pathname === "/logs" ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                    aria-hidden="true"
                  ></span>
                ) : null}
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default LeftSidebar;
