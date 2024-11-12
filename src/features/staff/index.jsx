import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import Pagination from "../../components/pagination";
import { selectAuthState } from "../../redux/authSlice";
import AddStaff from "./components/AddStaff";
import { getStaffs, selectStaffState } from "../../redux/staffSlice";

const TopSideButtons = ({ onOpenAddIncome }) => {
  return (
    <div className="inline-flex items-center gap-3 float">
      <button
        className="px-6 normal-case btn btn-sm btn-primary"
        onClick={onOpenAddIncome}
      >
        Add New Staff
      </button>
    </div>
  );
};

function StaffPage() {
  const dispatch = useDispatch();
  const { profile } = useSelector(selectAuthState);
  const { staffs, updateResult } = useSelector(selectStaffState);
  const [isOpenAddIncome, setOpenAddIncome] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [selectedItem, setSelectedItem] = useState(null);

  const onOpenAddIncome = () => setOpenAddIncome(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Staffs Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = useCallback(() => {
    dispatch(getStaffs({ pagination }));
  }, [updateResult, pagination]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Staffs Dashboard"
          topMargin="mt-2"
          TopSideButtons={
            profile?.role === "ADMIN" ? (
              <TopSideButtons onOpenAddIncome={onOpenAddIncome} />
            ) : null
          }
        >
          <div className="w-full overflow-x-auto scroll-custom">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {staffs.total ? (
                  <Fragment>
                    {staffs.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base">{car.id}</td>
                        <td className="text-base">{car.username}</td>
                        <td className="text-base">{car.email}</td>
                        <td className="text-base">{car.role}</td>
                      </tr>
                    ))}
                  </Fragment>
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>
      <div
        className={`flex items-center justify-end w-full mt-4 ${
          staffs.total === 0 ? "hidden" : "flex"
        }`}
      >
        <Pagination
          total={staffs.total}
          page={pagination.page}
          size={pagination.size}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>
      <AddStaff
        open={isOpenAddIncome}
        onClose={() => setOpenAddIncome(false)}
        size="lg"
      />
    </Fragment>
  );
}

export default StaffPage;
