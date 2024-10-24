import Pencil from "@heroicons/react/24/outline/PencilIcon";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import { setPageTitle } from "../common/headerSlice";
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

function CarManagement() {
  const dispatch = useDispatch();
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const onOpenAddModal = () => setOpenAddModal(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Car Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <th>Car ID</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Customer Name</th>
                  <th>Contract status</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#123</td>
                  <td>13/10/2024</td>
                  <td>23/10/2024</td>
                  <td>Duc</td>
                  <td>Expired</td>
                  <td>On rent</td>
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

export default CarManagement;
