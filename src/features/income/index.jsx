import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import AddIncome from "./components/AddIncome";
import AddOutcome from "./components/AddOutcome";
// import AddModal from "./components/AddModal";

const TopSideButtons = ({ onOpenAddIncome, onOpenAddOutcome }) => {
  return (
    <div className="inline-flex items-center gap-3 float">
      <button
        className="px-6 normal-case btn btn-sm btn-primary"
        onClick={onOpenAddIncome}
      >
        Add New Income
      </button>

      <button
        className="px-6 normal-case btn btn-sm btn-primary"
        onClick={onOpenAddOutcome}
      >
        Add New Expense
      </button>
    </div>
  );
};

function IncomeOutcomePage() {
  const dispatch = useDispatch();
  const [isOpenAddIncome, setOpenAddIncome] = useState(false);
  const [isOpenAddOutcome, setOpenAddOutcome] = useState(false);
  // const [searchText, setSearchText] = useState("");

  const onOpenAddIncome = () => setOpenAddIncome(true);
  const onOpenAddOutcome = () => setOpenAddOutcome(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Car Management" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div>
        <TitleCard
          title="Income & Expense Dashboard"
          topMargin="mt-2"
          TopSideButtons={
            <TopSideButtons
              onOpenAddIncome={onOpenAddIncome}
              onOpenAddOutcome={onOpenAddOutcome}
            />
          }
        >
          {/* <div className="flex items-center w-full gap-3 mb-6">
            <SearchBar
              searchText={searchText}
              styleClass="w-1/3"
              setSearchText={setSearchText}
            />
            <button className="w-32 btn btn-primary btn-sm">Search</button>
            <button className="w-32 btn btn-outline btn-sm">Reset</button>
          </div> */}
          <div className="w-full overflow-x-auto scroll-custom">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Staff</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>13/10/2024</td>
                  <td>Income</td>
                  <td>Test</td>
                  <td>Duc</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

      <AddIncome
        open={isOpenAddIncome}
        onClose={() => setOpenAddIncome(false)}
        size="lg"
      />
      <AddOutcome
        open={isOpenAddOutcome}
        onClose={() => setOpenAddOutcome(false)}
        size="lg"
      />
    </Fragment>
  );
}

export default IncomeOutcomePage;
