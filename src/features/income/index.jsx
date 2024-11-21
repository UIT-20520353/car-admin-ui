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
    dispatch(setPageTitle({ title: "Income & OutCome Management" }));
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
          title="Income & OutCome Dashboard"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onOpenAddIncome={onOpenAddIncome} />}
        >
          <div className="w-full overflow-x-auto scroll-custom max-h-[500px] overflow-y-auto">
            {pnl && (
              <div className="flex items-end w-full">
                <div className="flex items-center justify-center h-10 px-8 text-white bg-blue-500 border border-transparent font-bold">
                  Total
                </div>
                <div className="flex flex-col items-start flex-1 justify-stretch">
                  <span className="text-xs font-bold">Income</span>
                  <div className="flex items-center justify-between w-full h-10 px-2 text-black bg-white border border-l-0 border-gray-600">
                    <span>$</span>
                    <span>{pnl.income}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start flex-1 justify-stretch">
                  <span className="text-xs font-bold">Outcome By Cash</span>
                  <div className="flex items-center justify-between w-full h-10 px-2 text-black bg-white border border-l-0 border-gray-600">
                    <span>$</span>
                    <span>{pnl.outcomeByCash}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start flex-1 justify-stretch">
                  <span className="text-xs font-bold">Outcome By Bank</span>
                  <div className="flex items-center justify-between w-full h-10 px-2 text-black bg-white border border-l-0 border-gray-600">
                    <span>$</span>
                    <span>{pnl.outcomeByBank}</span>
                  </div>
                </div>
                <div className="border border-transparent flex items-center justify-between flex-[2_2_0%] h-10 px-2 text-white bg-blue-500">
                  <span>$</span>
                  <span>
                    {Number(pnl.income) -
                      Number(pnl.outcomeByCash) -
                      Number(pnl.outcomeByBank)}
                  </span>
                </div>
              </div>
            )}

            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Icome</th>
                  <th>Outcome By Cash</th>
                  <th>Outcome By Bank</th>
                  <th>Created User</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inouts.total ? (
                  <Fragment>
                    {inouts.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base">
                          {formatDateNoTime(car.date)}
                        </td>
                        <td className="text-base">{formatTime(car.date)}</td>
                        <td className="text-base">{car.income}</td>
                        <td className="text-base">{car.outcomeCash}</td>
                        <td className="text-base">{car.outcomeBank}</td>
                        <td className="text-base">
                          {car.createdUser.username}
                        </td>
                        <td>{car.note}</td>
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
