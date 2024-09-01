import { useCallback, useState } from 'react';

const inputHooks = {
  useInputState: (initialValue: string) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
      },
      [],
    );

    return {
      inputValue,
      handleChange,
    } as const;
  },
};

export const { useInputState } = inputHooks;
export default inputHooks;
