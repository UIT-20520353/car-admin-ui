import Pencil from "@heroicons/react/24/outline/PencilIcon";
import * as dayjs from "dayjs";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import Pagination from "../../components/pagination";
import { getCars } from "../../redux/carSlice";
import { getContracts } from "../../redux/contractSlice";
import { getRentals, selectRentalState } from "../../redux/rentalSlice";
import { setPageTitle } from "../common/headerSlice";
import AddModal from "./components/AddModal";
import { selectAuthState } from "../../redux/authSlice";
import EditModal from "./components/EditModal";

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
  const { rentals } = useSelector(selectRentalState);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [filter, setFilter] = useState({ carId: "" });
  const { profile } = useSelector(selectAuthState);
  const [selectedRental, setSelectedRental] = useState(null);

  const fetchContracts = useCallback(() => {
    dispatch(getRentals({ pagination, filter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onOpenAddModal = () => setOpenAddModal(true);

  const onReset = () => {
    setPagination({ page: 0, size: 10 });
    setFilter({ carId: "" });
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

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Payment Receipts"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onOpenAddModal={onOpenAddModal} />}
        >
          <div className="flex items-center w-full gap-3 mb-6">
            <SearchBar
              searchText={filter.carId}
              styleClass="w-1/3"
              setSearchText={(carId) => setFilter({ carId })}
              placeholderText="Search by car ID"
            />
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
                  <th>Car ID</th>
                  <th>Date</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Payment</th>
                  <th>Fee type</th>
                  <th>Amount</th>
                  <th>Note</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rentals.total ? (
                  <Fragment>
                    {rentals.list.map((rental) => (
                      <tr key={`rental-${rental.id}`}>
                        <td>#{rental.contract.car.id}</td>
                        <td>{dayjs(rental.date).format("DD/MM/YYYY")}</td>
                        <td>{dayjs(rental.startDate).format("DD/MM/YYYY")}</td>
                        <td>{dayjs(rental.endDate).format("DD/MM/YYYY")}</td>
                        <td>{EPayment[rental.payment].label}</td>
                        <td>{EFeeType[rental.feeType].label}</td>
                        <td>{rental.amount}</td>
                        <td>
                          <p className="whitespace-pre text-wrap">
                            {rental.note || "--"}
                          </p>
                        </td>
                        <td>
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-primary ${
                              isShowEditButton(rental) ? "flex" : "hidden"
                            }`}
                            onClick={() => setSelectedRental(rental)}
                          >
                            <Pencil width={20} height={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
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

            <div
              className={`flex items-center justify-end w-full mt-4 ${
                rentals.total === 0 ? "hidden" : "flex"
              }`}
            >
              <Pagination
                total={rentals.total}
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
    </Fragment>
  );
}

export default RentManagement;
