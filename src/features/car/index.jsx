import {
  BanknotesIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import Pencil from "@heroicons/react/24/outline/PencilIcon";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import { selectAuthState } from "../../redux/authSlice";
import { getCars, selectCarState } from "../../redux/carSlice";
import { formatDateNoTime } from "../../utils/date";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import { setPageTitle } from "../common/headerSlice";
import { openModal } from "../common/modalSlice";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import LogModal from "../common/LogModal";
import { fomatMoney } from "../../utils/uniqId";

const TopSideButtons = ({ onOpenAddModal }) => {
  return (
    <div className="inline-block float-right">
      <button
        className="px-6 normal-case btn btn-sm btn-primary"
        onClick={onOpenAddModal}
      >
        Add New
      </button>
    </div>
  );
};

function CarManagement() {
  const dispatch = useDispatch();
  const { cars, soldCarResult } = useSelector(selectCarState);
  const { profile } = useSelector(selectAuthState);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [selectedCar, setSelectedCar] = useState(null);
  const [filter, setFilter] = useState({
    registrationPlate: "",
    status: "",
    isSold: false,
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const loaderRef = useRef(null);

  const onOpenAddModal = () => setOpenAddModal(true);

  const renderStatus = (car) => {
    switch (car.status) {
      case "FREE":
        return (
          <div className="flex items-center justify-center p-2 text-base text-white badge badge-success w-[90px]">
            Free
          </div>
        );
      case "ON_RENT":
        return (
          <div className="flex items-center justify-center p-2 text-base text-white badge badge-error w-[90px]">
            On rent
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center p-2 text-base text-white badge badge-info w-[90px]">
            None
          </div>
        );
    }
  };

  const renderSold = (car) => {
    if (car.isSold) {
      return (
        <div className="flex items-center justify-center p-3 text-base text-white badge badge-error">
          SOLD
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center p-3 text-base text-white badge badge-success">
        NONE
      </div>
    );
  };

  const onReset = () => {
    setPagination({ page: 0, size: 10 });
    setFilter({ registrationPlate: "", status: "", isSold: false });
  };

  const fetchCars = useCallback(() => {
    dispatch(getCars({ pagination, filter }));
  }, [pagination, soldCarResult]);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Car Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const onSoldCar = (car) => {
    dispatch(
      openModal({
        title: "Sold Car",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to sold this car: ${car.name}?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SOLD_CAR,
          index: car.id,
        },
      })
    );
  };

  const handleIntersection = (entries, observer) => {
    const entry = entries[0];

    // When the loaderRef element intersects the viewport, fetch more data
    if (entry.isIntersecting && cars.total > cars.list.length) {
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
  }, [cars]);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Cars"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onOpenAddModal={onOpenAddModal} />}
        >
          <div className="flex items-center w-full gap-3 mb-6">
            <SearchBar
              searchText={filter.registrationPlate}
              styleClass="w-1/3"
              setSearchText={(name) =>
                setFilter((prev) => ({ ...prev, registrationPlate: name }))
              }
              placeholderText="Search by Registration plate"
            />
            <select
              className="w-1/3 select select-bordered select-sm"
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="FREE">Free</option>
              <option value="ON_RENT">On rent</option>
            </select>
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
          <div className="w-full overflow-auto scroll-custom max-h-96">
            <table className="table w-full">
              <thead className="bg-[#636363] text-white">
                <tr>
                  <th>Registration plate</th>
                  <th>Name</th>
                  <th>Is Sold</th>
                  <th>Buying Date</th>
                  <th>Buying Price</th>
                  <th>Car Play</th>
                  <th>GPS</th>
                  <th>Rego</th>
                  <th>Keys</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cars.total ? (
                  <Fragment>
                    {cars.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base">{car.registrationPlate}</td>
                        <td className="text-base">{car.name}</td>
                        <td className="text-base">{renderSold(car)}</td>
                        <td className="text-base">
                          {formatDateNoTime(car.buyingDate)}
                        </td>
                        <td className="text-base">
                          {fomatMoney(car.buyingPrice)}
                        </td>
                        <td className="text-base">{fomatMoney(car.carPlay)}</td>
                        <td className="text-base">{fomatMoney(car.gps)}</td>
                        <td className="text-base">{fomatMoney(car.rego)}</td>
                        <td className="text-base">{fomatMoney(car.keys)}</td>
                        <td>{renderStatus(car)}</td>
                        <td className="flex gap-2">
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-primary `}
                            disabled={profile?.role !== "ADMIN" || car.isSold}
                            onClick={() => setSelectedCar(car)}
                          >
                            <Pencil width={20} height={20} />
                          </button>
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-danger `}
                            disabled={
                              profile?.role !== "ADMIN" ||
                              car.isSold ||
                              car.status === "ON_RENT"
                            }
                            onClick={() => onSoldCar(car)}
                          >
                            <BanknotesIcon width={20} height={20} />
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
                      <td colSpan={10}>
                        <div ref={loaderRef} />
                      </td>
                    </tr>
                  </Fragment>
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

      <AddModal
        open={isOpenAddModal}
        onClose={() => setOpenAddModal(false)}
        refresh={() => setPagination({ page: 0, size: 10 })}
        size="lg"
      />
      <EditModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
        refresh={() => setPagination({ page: 0, size: 10 })}
        size="lg"
      />
      <LogModal
        item={selectedLog}
        onClose={() => setSelectedLog(null)}
        size="lg"
        cate={"CAR"}
      />
    </Fragment>
  );
}

export default CarManagement;
