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
import { formatDateNoTime } from "../../utils/date";
import { setPageTitle } from "../common/headerSlice";
import AddIncome from "./components/AddIncome";
import EditIncome from "./components/EditIncome";
import LogModal from "../common/LogModal";
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
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Id</th>
                  <th className="text-center">Type</th>
                  <th>Created Date</th>
                  <th>Amount</th>
                  <th>Item</th>
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
                        <td className="text-base">{car.id}</td>
                        <td className="flex justify-center">
                          {renderStatus(car)}
                        </td>
                        <td className="text-base">
                          {formatDateNoTime(car.createdDate)}
                        </td>
                        <td className="text-base">{car.amount}</td>
                        <td className="text-base">{car.item}</td>
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
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-success`}
                            onClick={() => setSelectedLog(car)}
                          >
                            <DocumentArrowDownIcon width={20} height={20} />
                          </button>
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
          {pnl && (
            <div className="flex flex-col items-end">
              <div className="flex justify-between w-[500px] font-bold">
                <p>Income By Cash:</p> <p>{pnl.totalInCash}</p>
              </div>
              <div className="flex justify-between w-[500px] font-bold">
                <p>Income By Bank:</p> <p>{pnl.totalInBank}</p>
              </div>
              <div className="flex justify-between w-[500px] font-bold">
                <p>Outcome By Cash:</p> <p>{pnl.totalOutCash}</p>
              </div>
              <div className="flex justify-between w-[500px] font-bold">
                <p>Outcome By Bank:</p> <p>{pnl.totalOutBank}</p>
              </div>
              <div className="flex justify-between w-[500px] font-bold border-t-2 border-black"></div>
              <div className="flex justify-between w-[500px] font-bold">
                <p>Total:</p>{" "}
                <p>
                  {Number(pnl.totalInCash) +
                    Number(pnl.totalInBank) -
                    Number(pnl.totalOutCash) -
                    Number(pnl.totalOutBank)}
                </p>
              </div>
            </div>
          )}
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
