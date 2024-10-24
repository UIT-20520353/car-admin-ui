import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../common/headerSlice";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import AddModal from "./components/AddModal";
import Pencil from "@heroicons/react/24/outline/PencilIcon";

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
          <div className="w-full overflow-x-auto scroll-custom">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Note</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>23/10/2024</td>
                  <td>13/10/2024</td>
                  <td>23/10/2024</td>
                  <td>Cash</td>
                  <td>$300</td>
                  <td>2131512341234</td>
                  <td>
                    <button className="btn btn-square btn-outline btn-sm btn-primary">
                      <Pencil width={20} height={20} />
                    </button>
                  </td>
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
