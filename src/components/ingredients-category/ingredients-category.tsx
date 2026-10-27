import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import { selectIngredientCounts } from '../../services/slices/constructorSlice';
import { useSelector } from '../../services/store';

import type { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const counts = useSelector(selectIngredientCounts);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    ingredients.forEach((ingredient) => {
      if (counts[ingredient._id]) counters[ingredient._id] = counts[ingredient._id];
    });
    return counters;
  }, [counts, ingredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
