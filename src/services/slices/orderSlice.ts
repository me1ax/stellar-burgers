import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null,
};

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/createOrder',
  async (ingredientIds) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder, closeOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

export const selectOrder = (state: { order: TOrderState }): TOrder | null =>
  state.order.order;

export const selectOrderRequest = (state: { order: TOrderState }): boolean =>
  state.order.orderRequest;

export const selectOrderModalData = (state: { order: TOrderState }): TOrder | null =>
  state.order.orderModalData;

export const selectOrderLoading = (state: { order: TOrderState }): boolean =>
  state.order.isLoading;

export const selectOrderError = (state: { order: TOrderState }): string | null =>
  state.order.error;
