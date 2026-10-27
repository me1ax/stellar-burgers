import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

type TMovePayload = {
  fromIndex: number;
  toIndex: number;
};

type TConstructorRootState = {
  burgerConstructor: TConstructorState;
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>): void => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<TMovePayload>): void => {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    },
    clearConstructor: (state): void => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

export const selectConstructorItems = (
  state: TConstructorRootState
): TConstructorState => state.burgerConstructor;

export const selectConstructorBun = (
  state: TConstructorRootState
): TConstructorIngredient | null => state.burgerConstructor.bun;

export const selectConstructorIngredients = (
  state: TConstructorRootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectConstructorPrice = (state: TConstructorRootState): number => {
  const { bun, ingredients } = state.burgerConstructor;
  const bunPrice = bun ? bun.price * 2 : 0;
  const fillingsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
  return bunPrice + fillingsPrice;
};

export const selectIngredientCounts = (
  state: TConstructorRootState
): Record<string, number> => {
  const { bun, ingredients } = state.burgerConstructor;
  const counts: Record<string, number> = {};
  ingredients.forEach((item) => {
    counts[item._id] = (counts[item._id] ?? 0) + 1;
  });
  if (bun) counts[bun._id] = 2;
  return counts;
};
