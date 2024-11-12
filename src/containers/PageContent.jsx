import { Suspense, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import RentManagement from "../features/rent";
import Header from "./Header";
import SuspenseContent from "./SuspenseContent";
import ContractPage from "../features/contract";
import CarManagement from "../features/car";
import IncomeOutcomePage from "../features/income";
import ItemPage from "../features/item";
import StaffPage from "../features/staff";
import { selectAuthState } from "../redux/authSlice";
// import routes from "../routes";

function PageContent() {
  const mainContentRef = useRef(null);
  const { pageTitle } = useSelector((state) => state.header);
  const { profile } = useSelector(selectAuthState);

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pageTitle]);

  return (
    <div className="flex flex-col drawer-content">
      <Header />
      <main
        className="flex-1 px-6 pt-4 overflow-y-auto md:pt-4 bg-base-200"
        ref={mainContentRef}
      >
        <Suspense fallback={<SuspenseContent />}>
          <Routes>
            <Route path="/cars" element={<CarManagement />} />
            <Route path="/contracts" element={<ContractPage />} />
            <Route path="/income-outcome" element={<IncomeOutcomePage />} />
            <Route path="/item" element={<ItemPage />} />
            {profile?.role === "ADMIN" && (
              <Route path="/staff" element={<StaffPage />} />
            )}

            <Route index element={<RentManagement />} />
            {/* {routes.map((route, key) => {
              return (
                <Route
                  key={key}
                  exact={true}
                  path={`${route.path}`}
                  element={<route.component />}
                />
              );
            })} */}

            {/* Redirecting unknown url to 404 page */}
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Suspense>
        <div className="h-16"></div>
      </main>
    </div>
  );
}

export default PageContent;
