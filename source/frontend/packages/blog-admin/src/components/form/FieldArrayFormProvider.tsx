// 下記を参考に作成
// github.com/orgs/react-hook-form/discussions/3942#discussioncomment-9165585

import React, { useContext } from 'react';
import type {
  FieldValues,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

type AllFormMethods<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues> & UseFieldArrayReturn<TFieldValues>;

const FieldArrayFormContext = React.createContext<AllFormMethods | null>(null);

FieldArrayFormContext.displayName = 'RHFArrayContext';

export const useFieldArrayFormContext = <
  TFieldValues extends FieldValues,
>(): AllFormMethods<TFieldValues> => {
  return useContext(FieldArrayFormContext) as AllFormMethods<TFieldValues>;
};

export declare type FieldArrayFormProviderProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  children: React.ReactNode;
} & AllFormMethods<TFieldValues>;

export const FieldArrayFormProvider = <TFieldValues extends FieldValues>({
  children,
  ...props
}: FieldArrayFormProviderProps<TFieldValues>) => {
  return (
    <FieldArrayFormContext.Provider value={{ ...props } as AllFormMethods}>
      {children}
    </FieldArrayFormContext.Provider>
  );
};
