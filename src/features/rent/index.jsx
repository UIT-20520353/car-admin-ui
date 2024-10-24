import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../common/headerSlice";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import AddModal from "./components/AddModal";

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
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const onOpenAddModal = () => setOpenAddModal(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Rental Payment Management" }));
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
              searchText={searchText}
              styleClass="w-1/3"
              setSearchText={setSearchText}
            />
            <button className="w-32 btn btn-primary btn-sm">Search</button>
            <button className="w-32 btn btn-outline btn-sm">Reset</button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Car ID</th>
                  <th>Status</th>
                  <th>Late days</th>
                  <th>Payment</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Start date</th>
                  <th>Duration</th>
                  <th>End date</th>
                  <th>Note</th>
                  <th>Staff name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>23/10/2024</td>
                  <td>#1</td>
                  <td>
                    <div className="flex items-center justify-center text-white badge badge-success">
                      On Time
                    </div>
                  </td>
                  <td>0</td>
                  <td>Cash</td>
                  <td>Rental Fee</td>
                  <td>$300</td>
                  <td>13/10/2024</td>
                  <td>10</td>
                  <td>23/10/2024</td>
                  <td></td>
                  <td>Sample</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

      <AddModal
        open={isOpenAddModal}
        onClose={() => setOpenAddModal(false)}
        size="lg"
      />
    </Fragment>
  );
}

export default RentManagement;
