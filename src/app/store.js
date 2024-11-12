import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import leadsSlice from "../features/leads/leadSlice";
import authSlice from "../redux/authSlice";
import contractSlice from "../redux/contractSlice";
import carSlice from "../redux/carSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  auth: authSlice,
  car: carSlice,
  contract: contractSlice,
};

export default configureStore({
  reducer: combinedReducer,
});
