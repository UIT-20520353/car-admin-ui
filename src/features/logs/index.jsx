import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import Pagination from "../../components/pagination";
import { selectAuthState } from "../../redux/authSlice";
import { getLogs, selectLogsState } from "../../redux/logSlice";
import { formatDateNoTime } from "../../utils/date";

function LogPage() {
  const dispatch = useDispatch();
  const { items } = useSelector(selectLogsState);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: "createdDate,desc",
  });
  const [filter, setFilter] = useState({ cate: "", type: "", recordId: "" });
  const loaderRef = useRef(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Logs Tracking" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = useCallback(() => {
    dispatch(getLogs({ pagination, filter }));
  }, [pagination]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleIntersection = (entries, observer) => {
    const entry = entries[0];

    // When the loaderRef element intersects the viewport, fetch more data
    if (entry.isIntersecting && items.total > items.list.length) {
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
  }, [items]);

  const onReset = () => {
    setPagination({ page: 0, size: 10 });
    setFilter({
      cate: "",
      type: "",
      recordId: "",
    });
  };

  return (
    <Fragment>
      <div className="max-h-[600px] overflow-auto">
        <TitleCard
          title="Logs Dashboard"
          topMargin="mt-2"
          TopSideButtons={null}
        >
          {" "}
          <div className="flex items-end w-full gap-3 mb-6">
            <div className="flex flex-col w-1/3">
              <span className="text-base font-medium">Log Category</span>
              <select
                className="w-full select select-bordered select-sm"
                value={filter.cate}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    cate: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="CAR">CAR</option>
                <option value="CONTRACT">CONTRACT</option>
                <option value="ITEM">ITEM</option>
                <option value="IN_OUT">IN_OUT</option>
                <option value="RENTAL">RENTAL</option>
              </select>
            </div>
            <div className="flex flex-col w-1/3">
              <span className="text-base font-medium">Log Type</span>
              <select
                className="w-full select select-bordered select-sm"
                value={filter.type}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="EDIT">EDIT</option>
                <option value="ADD">ADD</option>
                <option value="DELETE_OR_SOLD">DELETE_OR_SOLD</option>
              </select>
            </div>
            <button
              className="w-32 btn btn-primary btn-sm"
              onClick={() => setPagination({ page: 0, size: 10 })}
            >
              Search
            </button>
            <button className="w-32 btn btn-outline btn-sm" onClick={onReset}>
              Reset
            </button>
          </div>
          <div className="w-full overflow-x-auto scroll-custom">
            <table className="table w-full">
              <thead className="bg-[#636363] text-white">
                <tr>
                  <th>Id</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Record Id</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Before Data</th>
                  <th>After Data</th>
                </tr>
              </thead>
              <tbody>
                {items.total ? (
                  <Fragment>
                    {items.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base">{car.id}</td>
                        <td className="text-base">{car.cate}</td>
                        <td className="text-base">{car.type}</td>
                        <td className="text-base">{car.recordId}</td>
                        <td className="text-base">
                          {car.createUser ? car.createUser.username : "SYSTEM"}
                        </td>
                        <td className="text-base">
                          {formatDateNoTime(car.createdDate)}
                        </td>
                        <td className="text-base">
                          <pre>{car.beforeData.replaceAll("\n\n", "\n")}</pre>
                        </td>
                        <td className="text-base">
                          <pre>{car.afterData.replaceAll("\n\n", "\n")}</pre>
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
    </Fragment>
  );
}

export default LogPage;
