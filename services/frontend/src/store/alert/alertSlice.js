import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  severity: "info",
  message: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert(state, { payload }) {
      state.isOpen = payload.isOpen;
      state.severity = payload.severity;
      state.message = payload.message;
    },
    closeAlert(state) {
      state.isOpen = false;
    },
  },
});

export const { setAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
