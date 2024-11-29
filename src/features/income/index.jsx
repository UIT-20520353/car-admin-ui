import { DocumentArrowDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { getInOuts, getPnl, selectInoutState } from "../../redux/inoutSlice";
import { formatDateNoTime, formatTime } from "../../utils/date";
import { setPageTitle } from "../common/headerSlice";
import AddIncome from "./components/AddIncome";
import EditIncome from "./components/EditIncome";
import LogModal from "../common/LogModal";
import { selectAuthState } from "../../redux/authSlice";
import { fomatMoney } from "../../utils/uniqId";
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
  const { inouts, updateResult, pnl } = useSelector(selectInoutState);
  const { profile } = useSelector(selectAuthState);
  const [isOpenAddIncome, setOpenAddIncome] = useState(false);
  // const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState({ name: "", type: "" });
  const [selectedLog, setSelectedLog] = useState(null);
  const loaderRef = useRef(null);

  const onOpenAddIncome = () => setOpenAddIncome(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Cash Tracking " }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = useCallback(() => {
    dispatch(getInOuts({ pagination, filter }));
    dispatch(getPnl());
  }, [updateResult, pagination]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleIntersection = (entries, observer) => {
    const entry = entries[0];

    // When the loaderRef element intersects the viewport, fetch more data
    if (entry.isIntersecting && inouts.total > inouts.list.length) {
      setPagination((prev) => ({ ...prev, size: prev.size + 10 }));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [inouts]);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Cash Tracking"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onOpenAddIncome={onOpenAddIncome} />}
        >
          <div className="w-full overflow-x-auto scroll-custom max-h-[500px] overflow-y-auto">
            <table className="table w-full mt-4">
              <thead className="bg-[#636363] text-white">
                {pnl && (
                  <tr>
                    <th
                      colSpan={2}
                      className="text-sm bg-[#636363] text-white "
                    >
                      Total
                    </th>
                    <th className=" text-slate-900 bg-slate-300 text-right text-sm">
                      {fomatMoney(pnl.income)}
                    </th>
                    <th className=" text-slate-900 bg-slate-300 text-right text-sm">
                      {fomatMoney(pnl.outcomeByCash)}
                    </th>
                    <th className=" text-slate-900 bg-slate-300 text-right text-sm">
                      {fomatMoney(pnl.outcomeByBank)}
                    </th>
                    <th
                      className="text-sm  text-slate-900 bg-slate-300 text-right"
                      colSpan={3}
                    >
                      {fomatMoney(pnl.income - Number(pnl.outcomeByCash))}
                    </th>
                  </tr>
                )}

                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th className="text-right ">Pick</th>
                  <th className="text-right">Expense By Cash</th>
                  <th className="text-right">Expense By Bank</th>
                  <th>Note</th>
                  <th>Created User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inouts.total ? (
                  <Fragment>
                    {inouts.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base min-w-[70px] max-w-[70px]">
                          {formatDateNoTime(car.date)}
                        </td>
                        <td className="text-base min-w-[30px]  max-w-[30px]">
                          {formatTime(car.date)}
                        </td>
                        <td className="text-base text-right  min-w-[150px] max-w-[150px]">
                          {car.income}
                        </td>
                        <td className="text-base text-right min-w-[150px]  max-w-[150px]">
                          {car.outcomeCash}
                        </td>
                        <td className="text-base text-right min-w-[150px]  max-w-[150px]">
                          {car.outcomeBank}
                        </td>
                        <td>{car.note}</td>
                        <td className="text-base">
                          {car.createdUser.username}
                        </td>

                        <td className="flex gap-2">
                          <button
                            className="btn btn-square btn-outline btn-sm btn-primary"
                            onClick={() => setSelectedItem(car)}
                          >
                            <PencilIcon width={20} height={20} />
                          </button>
                          {profile?.role === "ADMIN" && (
                            <button
                              className={`btn btn-square btn-outline btn-sm btn-success`}
                              onClick={() => setSelectedLog(car)}
                            >
                              <DocumentArrowDownIcon width={20} height={20} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={8}>
                        <div ref={loaderRef} />
                      </td>
                    </tr>
                  </Fragment>
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
      <LogModal
        item={selectedLog}
        onClose={() => setSelectedLog(null)}
        size="lg"
        cate={"IN_OUT"}
      />
    </Fragment>
  );
}

export default IncomeOutcomePage;
