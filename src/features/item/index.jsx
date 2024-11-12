import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import AddItem from "./component/AddItem";
import { getItems, selectItems } from "../../redux/itemSlice";
import Pagination from "../../components/pagination";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { selectAuthState } from "../../redux/authSlice";
import EditItem from "./component/EditItem";

const TopSideButtons = ({ onOpenAddIncome }) => {
  return (
    <div className="inline-flex items-center gap-3 float">
      <button
        className="px-6 normal-case btn btn-sm btn-primary"
        onClick={onOpenAddIncome}
      >
        Add New Item
      </button>
    </div>
  );
};

function ItemPage() {
  const dispatch = useDispatch();
  const { profile } = useSelector(selectAuthState);
  const { items, updateResult } = useSelector(selectItems);
  const [isOpenAddIncome, setOpenAddIncome] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [selectedItem, setSelectedItem] = useState(null);

  const onOpenAddIncome = () => setOpenAddIncome(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Item Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = useCallback(() => {
    dispatch(getItems({ pagination }));
  }, [updateResult, pagination]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Items Dashboard"
          topMargin="mt-2"
          TopSideButtons={
            profile?.role === "ADMIN" ? (
              <TopSideButtons onOpenAddIncome={onOpenAddIncome} />
            ) : null
          }
        >
          <div className="w-full overflow-x-auto scroll-custom">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.total ? (
                  <Fragment>
                    {items.list.map((car) => (
                      <tr key={`car-${car.id}`}>
                        <td className="text-base">{car.id}</td>
                        <td className="text-base">{car.name}</td>

                        <td className=" flex justify-end gap-2">
                          <button
                            className="btn btn-square btn-outline btn-sm btn-primary"
                            onClick={() => setSelectedItem(car)}
                          >
                            <PencilIcon width={20} height={20} />
                          </button>
                          {/* {profile.role === "ADMIN" && (
                            <button
                              className="btn btn-square btn-outline btn-sm btn-danger"
                              onClick={() => setSelectedItem(car)}
                            >
                              <TrashIcon width={20} height={20} />
                            </button>
                          )} */}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>
      <div
        className={`flex items-center justify-end w-full mt-4 ${
          items.total === 0 ? "hidden" : "flex"
        }`}
      >
        <Pagination
          total={items.total}
          page={pagination.page}
          size={pagination.size}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>
      <AddItem
        open={isOpenAddIncome}
        onClose={() => setOpenAddIncome(false)}
        size="lg"
      />
      <EditItem
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        refresh={() => setPagination({ page: 0, size: 10 })}
        size="lg"
      />
    </Fragment>
  );
}

export default ItemPage;
