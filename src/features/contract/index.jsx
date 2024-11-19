import ArrowPathRoundedSquareIcon from "@heroicons/react/24/outline/ArrowPathRoundedSquareIcon";
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
import {
  getContracts,
  getContractsByCar,
  selectConstractState,
} from "../../redux/contractSlice";
import { setPageTitle } from "../common/headerSlice";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import RenewModal from "./components/RenewModal";
import NoSymbolIcon from "@heroicons/react/24/outline/NoSymbolIcon";
import EndModal from "./components/EndModal";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import LogModal from "../common/LogModal";
import { getStaffs } from "../../redux/staffSlice";

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
  const [filter, setFilter] = useState({ registrationPlate: "", status: "" });
  const [selectedContract, setSelectedContract] = useState(null);
  const [renewContract, setRenewContract] = useState(null);
  const [selectedContactToEnd, setSelectedContractToEnd] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const loaderRef = useRef(null);

  const onOpenAddModal = () => setOpenAddModal(true);

  const fetchContracts = useCallback(() => {
    if (filter.registrationPlate === "" && filter.status === "") {
      dispatch(getContractsByCar());
    } else {
      dispatch(getContracts({ pagination, filter }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, filter]);

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
    setFilter({ registrationPlate: "", status: "" });
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Contract Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [pagination]);

  useEffect(() => {
    dispatch(getCars({ pagination: { page: 0, size: 9999 }, filter: {} }));
    dispatch(getStaffs({ pagination: { page: 0, size: 9999 }, filter: {} }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntersection = (entries, observer) => {
    const entry = entries[0];

    // When the loaderRef element intersects the viewport, fetch more data
    if (entry.isIntersecting && contracts.total > contracts.list.length) {
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
  }, [contracts]);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Contracts"
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
                placeholderText="Search by Registration plate"
              />
            </div>
            <div className="flex flex-col w-1/3">
              <span className="text-base font-medium">Contract status</span>
              <select
                className="w-full select select-bordered select-sm"
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="NEW">New</option>
                <option value="RENEW">Renew</option>
                <option value="NEAR_EXPIRED">Near expired</option>
                <option value="END">End</option>
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
                  <th>Contract Id</th>
                  <th>Registration plate</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Customer Name</th>
                  <th>Contract status</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contracts.total ? (
                  <Fragment>
                    {contracts.list.map((contract) => (
                      <tr key={`contract-${contract.id}`}>
                        <td>#{ !!contract.newCar ? contract.newContractId : contract.id}</td>
                        <td>{contract.car.registrationPlate}</td>
                        <td>
                          {dayjs(contract.startDate).format("DD/MM/YYYY")}
                        </td>
                        <td>{dayjs(contract.endDate).format("DD/MM/YYYY")}</td>
                        <td>{contract.customerName}</td>
                        <td>{EContractStatus[contract.status].label}</td>
                        <td>
                          {!!contract.newCar ? (
                            <p className="whitespace-pre text-wrap">
                              {`New Car: ${contract.newCar.registrationPlate}`}
                            </p>
                          ) : (
                          <p className="whitespace-pre text-wrap">
                            {contract.note || "--"}
                          </p>)
                          }
                        </td>
                        <td className="flex gap-2">
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-primary`}
                            onClick={() => setSelectedContract(contract)}
                            disabled={!isShowEditButton(contract)}
                          >
                            <Pencil width={20} height={20} />
                          </button>
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-primary `}
                            disabled={
                              contract.status !== "END" || !!contract.newCar
                            }
                            onClick={() => setRenewContract(contract)}
                          >
                            <ArrowPathRoundedSquareIcon
                              width={20}
                              height={20}
                            />
                          </button>
                          <button
                            className={`btn btn-square btn-outline btn-sm btn-error`}
                            disabled={contract.status === "END"}
                            onClick={() => setSelectedContractToEnd(contract)}
                          >
                            <NoSymbolIcon width={20} height={20} />
                          </button>
                          {profile?.role === "ADMIN" && (
                            <button
                              className={`btn btn-square btn-outline btn-sm btn-success`}
                              onClick={() => setSelectedLog(contract)}
                            >
                              <DocumentArrowDownIcon width={20} height={20} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={6}>
                        <div ref={loaderRef} />
                      </td>
                    </tr>
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
      <RenewModal
        selectedContract={renewContract}
        onClose={() => setRenewContract(null)}
        size="lg"
        refresh={() => setPagination({ page: 0, size: 10 })}
      />
      <EndModal
        selectedContract={selectedContactToEnd}
        onClose={() => setSelectedContractToEnd(null)}
        size="lg"
        refresh={() => setPagination({ page: 0, size: 10 })}
      />
      <LogModal
        item={selectedLog}
        onClose={() => setSelectedLog(null)}
        size="lg"
        cate={"CONTRACT"}
      />
    </Fragment>
  );
}

export default ContractPage;
