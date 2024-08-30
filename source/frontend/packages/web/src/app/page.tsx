'use client';
import Button from '@/components/elements/Button/Button';
import NumberInput from '@/components/elements/Input/NumberInput';
import { useInputState } from '@/components/elements/Input/numberInputHooks';
import { sum } from '@/utils/functions';
import { useCallback, useState } from 'react';

export default function Home() {
  const { inputValue: firstNum, handleChange: handleChangeFirstNum } =
    useInputState('');
  const { inputValue: secondNum, handleChange: handleChangeSecondNum } =
    useInputState('');

  const [result, setResult] = useState('');
  const handleClickSum = useCallback(() => {
    const n1 = Number(firstNum);
    const n2 = Number(secondNum);
    setResult(sum(n1, n2).toString());
  }, [firstNum, secondNum]);

  return (
    <main>
      <h2>計算機</h2>
      <NumberInput
        name="num1"
        value={firstNum}
        onChange={handleChangeFirstNum}
      />
      <NumberInput
        name="num2"
        value={secondNum}
        onChange={handleChangeSecondNum}
      />
      <Button onClick={handleClickSum}>計算</Button>
      結果: <span>{result}</span>
    </main>
  );
}
