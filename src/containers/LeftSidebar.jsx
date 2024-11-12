import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { Link, NavLink, useLocation } from "react-router-dom";
import routes from "../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";
import { selectAuthState } from "../redux/authSlice";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

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
            Admin
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
          <li className="">
            <NavLink
              end
              to="/staff"
              className={({ isActive }) =>
                `${isActive ? "font-semibold  bg-base-200 " : "font-normal"}`
              }
            >
              <UserIcon className="h-6 w-6" /> Staff
              {location.pathname === "/staff" ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                  aria-hidden="true"
                ></span>
              ) : null}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default LeftSidebar;
