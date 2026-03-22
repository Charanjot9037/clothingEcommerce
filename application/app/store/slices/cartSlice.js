import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalCount: 0,
  },
  reducers: {
    setCart: (state, action) => {
      state.items      = action.payload.items ?? [];
      state.totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },
    clearCartState: (state) => {
      state.items      = [];
      state.totalCount = 0;
    },
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;