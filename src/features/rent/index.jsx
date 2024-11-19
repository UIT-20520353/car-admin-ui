import Pencil from "@heroicons/react/24/outline/PencilIcon";
import * as dayjs from "dayjs";
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
import { getCars } from "../../redux/carSlice";
import { getContracts } from "../../redux/contractSlice";
import { getRentals, selectRentalState } from "../../redux/rentalSlice";
import { setPageTitle } from "../common/headerSlice";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import { DocumentArrowDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import { openModal } from "../common/modalSlice";
import LogModal from "../common/LogModal";

const EPayment = {
  CASH: { value: "CASH", label: "Cash" },
  BANK: { value: "BANK", label: "Bank" },
  SQUARE: { value: "SQUARE", label: "Square" },
};

const EFeeType = {
  RENTAL_FEE: { value: "RENTAL_FEE", label: "Rental fee" },
  LATE_FEE: { value: "LATE_FEE", label: "Late fee" },
  ACCIDENT_FEE: { value: "ACCIDENT_FEE", label: "Accident fee" },
};

const ERentalStatus = {
  OVERDUE: { value: "OVERDUE", label: "Overdue" },
  INDUE: { value: "INDUE", label: "Indue" },
};

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

function RentManagement() {
  const dispatch = useDispatch();
  const { rentals, deleteCarResult } = useSelector(selectRentalState);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [filter, setFilter] = useState({
    registrationPlate: "",
    contractId: "",
    paymentType: "",
    rentalStatus: "",
  });
  const { profile } = useSelector(selectAuthState);
  const [selectedRental, setSelectedRental] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const loaderRef = useRef(null);

  const fetchContracts = useCallback(() => {
    dispatch(getRentals({ pagination, filter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, deleteCarResult]);

  const onOpenAddModal = () => setOpenAddModal(true);

  const onReset = () => {
    setPagination({ page: 0, size: 10 });
    setFilter({
      registrationPlate: "",
      contractId: "",
      paymentType: "",
      rentalStatus: "",
    });
  };

  const isShowEditButton = (rental) => {
    const isLessThan24Hours =
      dayjs().diff(dayjs(rental.createdDate), "hour") < 24;

    if (profile?.role === "ADMIN") {
      return true;
    }
    return profile?.id === rental.createUser.id && isLessThan24Hours;
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Rental Payment Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    dispatch(getCars({ pagination: { page: 0, size: 9999 }, filter: {} }));
    dispatch(
      getContracts({
        pagination: { page: 0, size: 9999 },
        filter: { status: "NEW,RENEW,NEAR_EXPIRED" },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntersection = (entries, observer) => {
    const entry = entries[0];

    // When the loaderRef element intersects the viewport, fetch more data
    if (entry.isIntersecting && rentals.total > rentals.list.length) {
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
  }, [rentals]);

  const onDeleteRental = (payment) => {
    dispatch(
      openModal({
        title: "Delete payment",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this payment?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_RENTAL,
          index: payment.id,
        },
      })
    );
  };

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Payment Receipts"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onOpenAddModal={onOpenAddModal} />}
        >
          <div className="flex items-end w-full gap-3 mb-6">
            <div className="flex flex-col w-1/3">
              <span className="text-base font-medium">Registration plate</span>
              <SearchBar
                searchText={filter.registrationPlate}
                styleClass="w-full"
                setSearchText={(registrationPlate) =>
                  setFilter((prev) => ({ ...prev, registrationPlate }))
                }
                placeholderText="Search by car ID"
              />
            </div>
            <div className="flex flex-col w-1/3">
              <span className="text-base font-medium">Rental status</span>
              <select
                className="w-full select select-bordered select-sm"
                value={filter.rentalStatus}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    rentalStatus: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="OVERDUE">Overdue</option>
                <option value="INDUE">Indue</option>
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
              <thead>
                <tr>
                  <th>Registion Plate</th>
                  <th>Contract ID</th>
                  <th>Date</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Payment</th>
                  <th>Fee type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rentals.total ? (
                  <Fragment>
                    {rentals.list.map((rental) => (
                      <tr key={`rental-${rental.id}`}>
                        <td>{rental.car.registrationPlate}</td>
                        <td>#{rental.contract.id}</td>
                        <td>{dayjs(rental.date).format("DD/MM/YYYY")}</td>
                        <td>{dayjs(rental.startDate).format("DD/MM/YYYY")}</td>
                        <td>{dayjs(rental.endDate).format("DD/MM/YYYY")}</td>
                        <td>{EPayment[rental.payment].label}</td>
                        <td>{EFeeType[rental.feeType].label}</td>
                        <td>
                          {ERentalStatus[rental.status || "ON_TIME"].label}
                        </td>
                        <td>{rental.amount}</td>
                        <td>
                          <p className="whitespace-pre text-wrap">
                            {rental.note || "--"}
                          </p>
                        </td>
                        <td className="flex gap-2">
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-primary ${
                              isShowEditButton(rental) ? "flex" : "hidden"
                            }`}
                            onClick={() => setSelectedRental(rental)}
                            disabled={rental.contract.car.id !== rental.car.id}
                          >
                            <Pencil width={20} height={20} />
                          </button>
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-danger ${
                              isShowEditButton(rental) ? "flex" : "hidden"
                            }`}
                            onClick={() => onDeleteRental(rental)}
                          >
                            <TrashIcon width={20} height={20} />
                          </button>
                          {profile?.role === "ADMIN" && (
                            <button
                              className={`btn btn-square btn-outline btn-sm btn-success`}
                              onClick={() => setSelectedLog(rental)}
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
        size="lg"
        refresh={() => setPagination({ page: 0, size: 10 })}
      />
      <EditModal
        rental={selectedRental}
        onClose={() => setSelectedRental(null)}
        size="lg"
        refresh={() => setPagination({ page: 0, size: 10 })}
      />
      <LogModal
        item={selectedLog}
        onClose={() => setSelectedLog(null)}
        size="lg"
        cate={"RENTAL"}
      />
    </Fragment>
  );
}

export default RentManagement;
