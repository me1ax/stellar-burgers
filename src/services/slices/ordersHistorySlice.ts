import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrdersHistoryState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersHistoryState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchOrdersHistory = createAsyncThunk<TOrder[]>(
  'ordersHistory/fetch',
  async () => getOrdersApi()
);

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      });
  },
});

export const ordersHistoryReducer = ordersHistorySlice.reducer;

export const selectOrdersHistory = (state: {
  ordersHistory: TOrdersHistoryState;
}): TOrder[] => state.ordersHistory.orders;

export const selectOrdersHistoryLoading = (state: {
  ordersHistory: TOrdersHistoryState;
}): boolean => state.ordersHistory.isLoading;
