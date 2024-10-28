import { useFieldArrayFormContext } from '@/components/form/FieldArrayFormProvider';

export function AddH2Button() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h2', text: '' })}>
      h2
    </button>
  );
}
