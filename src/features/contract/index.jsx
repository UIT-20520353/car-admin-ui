import Pencil from "@heroicons/react/24/outline/PencilIcon";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import { getCars } from "../../redux/carSlice";
import { getContracts, selectConstractState } from "../../redux/contractSlice";
import { setPageTitle } from "../common/headerSlice";
import AddModal from "./components/AddModal";
import { selectAuthState } from "../../redux/authSlice";
import * as dayjs from "dayjs";
import Pagination from "../../components/pagination";
import EditModal from "./components/EditModal";

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

const EContractStatus = {
  NEW: { value: "NEW", label: "New" },
  RENEW: { value: "RENEW", label: "Renew" },
  NEAR_EXPIRED: { value: "NEAR_EXPIRED", label: "Near expired" },
  END: { value: "END", label: "End" },
};

function ContractPage() {
  const dispatch = useDispatch();
  const { contracts } = useSelector(selectConstractState);
  const { profile } = useSelector(selectAuthState);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [filter, setFilter] = useState({ carId: "" });
  const [selectedContract, setSelectedContract] = useState(null);

  const onOpenAddModal = () => setOpenAddModal(true);

  const fetchContracts = useCallback(() => {
    dispatch(getContracts({ pagination, filter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const isShowEditButton = (contract) => {
    const isLessThan24Hours =
      dayjs().diff(dayjs(contract.createdDate), "hour") < 24;

    if (contract.status === EContractStatus.END.value) {
      return false;
    }

    if (profile?.role === "ADMIN") {
      return true;
    }

    return profile?.id === contract.createUser.id && isLessThan24Hours;
  };

  const onReset = () => {
    setPagination({ page: 0, size: 10 });
    setFilter({ name: "" });
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Contract Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    dispatch(getCars({ pagination: { page: 0, size: 9999 }, filter: {} }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Contracts"
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
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Customer Name</th>
                  <th>Contract status</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contracts.total ? (
                  <Fragment>
                    {contracts.list.map((contract) => (
                      <tr key={`contract-${contract.id}`}>
                        <td>#{contract.car.id}</td>
                        <td>
                          {dayjs(contract.startDate).format("DD/MM/YYYY")}
                        </td>
                        <td>{dayjs(contract.endDate).format("DD/MM/YYYY")}</td>
                        <td>{contract.customerName}</td>
                        <td>{EContractStatus[contract.status].label}</td>
                        <td>
                          <p className="whitespace-pre text-wrap">
                            {contract.note || "--"}
                          </p>
                        </td>
                        <td>
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-primary ${
                              isShowEditButton(contract) ? "flex" : "hidden"
                            }`}
                            onClick={() => setSelectedContract(contract)}
                          >
                            <Pencil width={20} height={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div
              className={`flex items-center justify-end w-full mt-4 ${
                contracts.total === 0 ? "hidden" : "flex"
              }`}
            >
              <Pagination
                total={contracts.total}
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
        selectedContract={selectedContract}
        onClose={() => setSelectedContract(null)}
        size="lg"
        refresh={() => setPagination({ page: 0, size: 10 })}
      />
    </Fragment>
  );
}

export default ContractPage;
