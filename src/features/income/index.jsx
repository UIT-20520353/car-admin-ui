import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import AddIncome from "./components/AddIncome";
import AddOutcome from "./components/AddOutcome";
import { selectAuthState } from "../../redux/authSlice";
import { getInOuts, selectInoutState } from "../../redux/inoutSlice";
import Pagination from "../../components/pagination";
import { formatDateNoTime } from "../../utils/date";
import { PencilIcon } from "@heroicons/react/24/outline";
import EditIncome from "./components/EditIncome";
// import AddModal from "./components/AddModal";

const TopSideButtons = ({ onOpenAddIncome }) => {
  return (
    <div className="inline-flex items-center gap-3 float">
      <button
        className="px-6 normal-case btn btn-sm btn-primary"
        onClick={onOpenAddIncome}
      >
        Add New
      </button>
    </div>
  );
};

function IncomeOutcomePage() {
  const dispatch = useDispatch();
  const { profile } = useSelector(selectAuthState);
  const { inouts, updateResult } = useSelector(selectInoutState);
  const [isOpenAddIncome, setOpenAddIncome] = useState(false);
  // const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState({ name: "", type: "" });

  const onOpenAddIncome = () => setOpenAddIncome(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Income & OutCome Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = useCallback(() => {
    dispatch(getInOuts({ pagination, filter }));
  }, [updateResult, pagination]);

  const renderStatus = (inout) => {
    switch (inout.type) {
      case "INCOME":
        return (
          <div className="flex items-center justify-center p-3 text-sm font-bold text-white badge badge-success w-[100px]">
            INCOME
          </div>
        );
      case "OUTCOME":
        return (
          <div className="flex items-center justify-center p-3 text-sm font-bold text-white badge badge-error w-[100px]">
            OUTCOME
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center p-3 text-base text-white badge badge-info w-[100px]">
            None
          </div>
        );
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Income & OutCome Dashboard"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onOpenAddIncome={onOpenAddIncome} />}
        >
          <div className="w-full overflow-x-auto scroll-custom">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Id</th>
                  <th className="text-center">Type</th>
                  <th>Amount</th>
                  <th>Item</th>
                  <th>Created User</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inouts.total ? (
                  <Fragment>
                    {inouts.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base">{car.id}</td>
                        <td className="flex justify-center">
                          {renderStatus(car)}
                        </td>
                        <td className="text-base">{car.amount}</td>
                        <td className="text-base">{car.item}</td>
                        <td className="text-base">
                          {car.createdUser.username}
                        </td>
                        <td className="text-base">
                          {formatDateNoTime(car.createdDate)}
                        </td>
                        <td>
                          <button
                            className="btn btn-square btn-outline btn-sm btn-primary"
                            onClick={() => setSelectedItem(car)}
                          >
                            <PencilIcon width={20} height={20} />
                          </button>
                        </td>
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
            <div
              className={`flex items-center justify-end w-full mt-4 ${
                inouts.total === 0 ? "hidden" : "flex"
              }`}
            >
              <Pagination
                total={inouts.total}
                page={pagination.page}
                size={pagination.size}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </div>
          </div>
        </TitleCard>
      </div>

      <AddIncome
        open={isOpenAddIncome}
        onClose={() => setOpenAddIncome(false)}
        size="lg"
      />
      <EditIncome
        inout={selectedItem}
        onClose={() => setSelectedItem(null)}
        refresh={() => setPagination({ page: 0, size: 10 })}
        size="lg"
      />
    </Fragment>
  );
}

export default IncomeOutcomePage;
