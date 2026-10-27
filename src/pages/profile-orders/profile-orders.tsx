import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchOrdersHistory,
  selectOrdersHistory,
  selectOrdersHistoryLoading,
} from '../../services/slices/ordersHistorySlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrdersHistory);
  const isLoading = useSelector(selectOrdersHistoryLoading);

  useEffect(() => {
    void dispatch(fetchOrdersHistory());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
