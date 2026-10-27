import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorPrice,
} from '../../services/slices/constructorSlice';
import {
  closeOrderModal,
  createOrder,
  selectOrderModalData,
  selectOrderRequest,
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorState } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const price = useSelector(selectConstructorPrice);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const constructorItems: TConstructorState = useMemo(
    () => ({ bun, ingredients }),
    [bun, ingredients]
  );

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => undefined);
  };

  const closeOrderModalHandler = (): void => {
    dispatch(closeOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
