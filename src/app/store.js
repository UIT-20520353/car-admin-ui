import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import leadsSlice from "../features/leads/leadSlice";
import authSlice from "../redux/authSlice";
import carSlice from "../redux/carSlice";
import itemSlice from "../redux/itemSlice";
import staffSlice from "../redux/staffSlice";
import inoutSlice from "../redux/inoutSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  auth: authSlice,
  car: carSlice,
  items: itemSlice,
  staffs: staffSlice,
  inout: inoutSlice,
};

export default configureStore({
  reducer: combinedReducer,
});
